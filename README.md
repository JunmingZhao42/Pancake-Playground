# Simple Pancake Playground

A lightweight browser-based Pancake code editor and compiler playground.

## Quick Start

1. **Setup:**
   ```bash
   npm init -y
   npm install express cors uuid
   ```

2. **Configure Environment**
 - `$CAKE_ML`: Path to your local CakeML compiler
 - `$p2v`: Path to your local transpiler
 - `$Z3_EXE`: Path to Z3 executable
 - `$JAVA_HOME`: Java installation directory
 - `export DYLD_LIBRARY_PATH=$JAVA_HOME/lib:$DYLD_LIBRARY_PATH`
 - `$VIPER_HOME`: Path to `ViperTools/backends`

3. **Run:**
   ```bash
   node server.js
   ```

4. **Open** `index.html` in your browser
