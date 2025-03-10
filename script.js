const editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/pancake");
editor.setFontSize(14);
editor.getSession().setTabSize(2);
editor.getSession().setUseSoftTabs(true);

const viperEditor = ace.edit("viper-editor");
viperEditor.setTheme("ace/theme/monokai");
viperEditor.session.setMode("ace/mode/pancake");
viperEditor.setFontSize(14);
viperEditor.setReadOnly(true);
viperEditor.getSession().setTabSize(2);
viperEditor.getSession().setUseSoftTabs(true);

editor.setValue(`// Line comment: Write your Pancake code here
/*
    Block comment
*/
fun main() {
  var base_ptr = @base;
  st base_ptr, 42;
  var x = lds 1 base_ptr;

  @print(0,x,0,1000);
  return 0;          
}`, -1);

async function compile() {
    const code = editor.getValue();
    const outputElement = document.getElementById('compiler-output');
    
    outputElement.textContent = "Compiling...";
    
    try {
        const response = await fetch('http://localhost:3000/compile1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });
        
        const result = await response.json();
        
        if (result.error) {
            outputElement.textContent = `Compilation Error:\n${result.error}`;
        } else {
            outputElement.textContent = result.output;
        }
    } catch (error) {
        outputElement.textContent = `Error: ${error.message}\n\nMake sure the backend server is running at http://localhost:3000`;
    }
}

async function transpile() {
    const code = editor.getValue();
    const transpilerOutputElement = document.getElementById('transpiler-output');
    
    transpilerOutputElement.textContent = "Transpiling...";
    viperEditor.setValue("");
    
    try {
        const response = await fetch('http://localhost:3000/compile2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });
        
        const result = await response.json();
        
        if (result.error) {
            transpilerOutputElement.textContent = `Transpilation Error:\n${result.error}`;
        } else {
            transpilerOutputElement.textContent = result.output;
            
            if (result.viperCode) {
                viperEditor.setValue(result.viperCode, -1);
                viperEditor.clearSelection();
            }
        }
    } catch (error) {
        transpilerOutputElement.textContent = `Error: ${error.message}\n\nMake sure the backend server is running at http://localhost:3000`;
    }
}

document.getElementById('compile-button').addEventListener('click', compile);
document.getElementById('transpile-button').addEventListener('click', transpile);

editor.commands.addCommand({
    name: 'compile',
    bindKey: {win: 'F9', mac: 'F9'},
    exec: compile
});

editor.commands.addCommand({
    name: 'transpile',
    bindKey: {win: 'F10', mac: 'F10'},
    exec: transpile
});

function initSplitters() {
    const container = document.getElementById('main-container');
    const verticalSplitter = document.getElementById('vertical-splitter');
    const compilerTranspilerSplitter = document.getElementById('compiler-transpiler-splitter');
    const topViperSplitter = document.getElementById('top-viper-splitter');
    const editorPanel = document.querySelector('.editor-panel');
    const outputContainer = document.querySelector('.output-container');
    const outputTopRow = document.querySelector('.output-top-row');
    const compilerPanel = document.querySelector('.compiler-panel');
    const transpilerPanel = document.querySelector('.transpiler-panel');
    const viperPanel = document.querySelector('.viper-panel');
    
    function startVerticalDrag(e) {
        e.preventDefault();
        document.body.classList.add('resize-active');
        
        const startX = e.clientX;
        const startWidth = editorPanel.offsetWidth;
        const containerWidth = container.offsetWidth;
        
        const minWidth = containerWidth * 0.4;
        const maxWidth = containerWidth * 0.6;
        
        function onMouseMove(e) {
            const newWidth = Math.max(
                minWidth, 
                Math.min(
                    maxWidth, 
                    startWidth + e.clientX - startX
                )
            );
            
            editorPanel.style.width = newWidth + 'px';
            editorPanel.style.flex = 'none';
            
            // Update editors size
            editor.resize();
            viperEditor.resize();
        }
        
        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.body.classList.remove('resize-active');
            verticalSplitter.classList.remove('active');
        }
        
        verticalSplitter.classList.add('active');
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
    
    // Vertical splitter between compiler and transpiler panels
    function startCompilerTranspilerDrag(e) {
        e.preventDefault();
        document.body.classList.add('resize-active');
        
        const startX = e.clientX;
        const outputContainerWidth = outputContainer.offsetWidth;
        const compilerRect = compilerPanel.getBoundingClientRect();
        const startWidth = compilerRect.width;
        
        const minWidth = 150;
        const maxWidth = outputContainerWidth - minWidth - 8;
        
        function onMouseMove(e) {
            const newWidth = Math.max(
                minWidth, 
                Math.min(
                    maxWidth, 
                    startWidth + e.clientX - startX
                )
            );
            
            compilerPanel.style.width = newWidth + 'px';
            compilerPanel.style.flex = 'none';
            
            viperEditor.resize();
        }
        
        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.body.classList.remove('resize-active');
            compilerTranspilerSplitter.classList.remove('active');
        }
        
        compilerTranspilerSplitter.classList.add('active');
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
    
    function startTopViperDrag(e) {
        e.preventDefault();
        document.body.classList.add('resize-active');
        
        const startY = e.clientY;
        const outputContainerHeight = outputContainer.offsetHeight;
        const topRowRect = outputTopRow.getBoundingClientRect();
        const startHeight = topRowRect.height;
        
        const minHeight = 100;
        const maxHeight = 250;
        
        function onMouseMove(e) {
            const newHeight = Math.max(
                minHeight, 
                Math.min(
                    maxHeight, 
                    startHeight + e.clientY - startY
                )
            );
            
            outputTopRow.style.height = newHeight + 'px';
            outputTopRow.style.flex = 'none';
            
            viperEditor.resize();
        }
        
        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.body.classList.remove('resize-active');
            topViperSplitter.classList.remove('active');
        }
        
        topViperSplitter.classList.add('active');
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
    
    verticalSplitter.addEventListener('mousedown', startVerticalDrag);
    compilerTranspilerSplitter.addEventListener('mousedown', startCompilerTranspilerDrag);
    topViperSplitter.addEventListener('mousedown', startTopViperDrag);
    
    window.addEventListener('resize', function() {
        editor.resize();
        viperEditor.resize();
    });
}

document.addEventListener('DOMContentLoaded', initSplitters);

window.addEventListener('load', function() {
    editor.resize();
    viperEditor.resize();
});