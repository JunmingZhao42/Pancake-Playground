const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const TEMP_DIR = path.join(__dirname, 'temp');
const CAKE_EXE = process.env.CAKE_ML;
const FFI_FILE = path.join(__dirname, 'lib/basic_ffi.c');
const VIPER_TRANSPILER = process.env.p2v;

if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const cleanupFiles = (files) => {
    files.forEach(file => {
        if (fs.existsSync(file)) {
            try {
                fs.unlinkSync(file);
            } catch (err) {
                console.error(`Error deleting file ${file}:`, err);
            }
        }
    });
};

// First compiler endpoint (Pancake)
app.post('/compile1', (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'No code provided' });
    }

    const fileId = uuidv4();
    const sourceFile = path.join(TEMP_DIR, `${fileId}.🥞`);
    const assemblyFile = path.join(TEMP_DIR, `${fileId}.S`);
    const execFile = path.join(TEMP_DIR, `${fileId}`);
    const filesToCleanup = [sourceFile, assemblyFile, execFile];

    try {
        fs.writeFileSync(sourceFile, code);
    } catch (err) {
        return res.status(500).json({ error: `Failed to write source file: ${err.message}` });
    }

    const compileCmd1 = `${CAKE_EXE} --pancake --main_return=true --target=arm8 < ${sourceFile} > ${assemblyFile}`;
    exec(compileCmd1, (error1, stdout1, stderr1) => {
        if (error1) {
            cleanupFiles([sourceFile]);
            return res.json({
                error: `Pancake Compilation Error: ${stderr1 || error1.message}`
            });
        }

        const compileCmd2 = `gcc ${FFI_FILE} ${assemblyFile} -o ${execFile}`;
        exec(compileCmd2, (error2, stdout2, stderr2) => {
            if (error2) {
                cleanupFiles([sourceFile, assemblyFile]);
                return res.json({
                    error: `GCC Compilation Error: ${stderr2 || error2.message}`
                });
            }

            // timeout: 5 sec
            exec(execFile, { timeout: 5000 }, (error3, stdout3, stderr3) => {
                cleanupFiles(filesToCleanup);

                if (error3) {
                    if (error3.killed) {
                        return res.json({ error: 'Program execution timed out (5 seconds limit)' });
                    }
                    return res.json({
                        error: `Runtime Error: ${stderr3 || error3.message}`
                    });
                }

                return res.json({
                    output: stdout3,
                    assembly: fs.existsSync(assemblyFile) ? fs.readFileSync(assemblyFile, 'utf8') : null
                });
            });
        });
    });
});

app.post('/compile2', (req, res) => {
    const { code } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'No code provided' });
    }

    const fileId = uuidv4();
    const sourceFile = path.join(TEMP_DIR, `${fileId}.🥞`);
    const viperFile = path.join(TEMP_DIR, `${fileId}.vpr`);

    try {
        fs.writeFileSync(sourceFile, code);
    } catch (err) {
        return res.status(500).json({ error: `Failed to write source file: ${err.message}` });
    }

    const transpilerCmd = `${VIPER_TRANSPILER} transpile ${sourceFile} ${viperFile} --disable-prelude --disable-overflow-check`;
    
    exec(transpilerCmd, (error1, stdout1, stderr1) => {
        if (error1) {
            cleanupFiles([sourceFile]);
            return res.json({
                error: `Transpiler Error: ${stderr1 || error1.message}`
            });
        }

        let viperCode = '';
        if (fs.existsSync(viperFile)) {
            try {
                viperCode = fs.readFileSync(viperFile, 'utf8');
            } catch (err) {
                console.error(`Error reading Viper file: ${err.message}`);
            }
        } else {
            console.error('Viper output file was not created');
        }

        cleanupFiles([sourceFile, viperFile]);
        return res.json({
            output: stdout1,
            viperCode: viperCode
        });
    });
});

app.get('/lib/pancake-highlight.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'pancake-highlight.js'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Temporary files stored in: ${TEMP_DIR}`);
});
