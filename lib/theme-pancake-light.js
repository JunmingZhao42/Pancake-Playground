define("ace/theme/pancake_light",["require","exports","module","ace/lib/dom"],function(e,t,n){
    t.isDark=false;
    t.cssClass="ace-pancake-light";
    t.cssText=".ace-pancake-light .ace_gutter {background: #f7f7f7;color: #787878;border-right: 1px solid #e7e7e7}" +
    ".ace-pancake-light .ace_print-margin {width: 1px;background: #e8e8e8}" +
    ".ace-pancake-light {background-color: #ffffff;color: #333333}" +
    ".ace-pancake-light .ace_cursor {color: #000000}" +
    ".ace-pancake-light .ace_marker-layer .ace_selection {background: #316AC5;opacity: 0.2}" +
    ".ace-pancake-light.ace_multiselect .ace_selection.ace_start {box-shadow: 0 0 3px 0px #ffffff}" +
    ".ace-pancake-light .ace_marker-layer .ace_step {background: #fcff00}" +
    ".ace-pancake-light .ace_marker-layer .ace_bracket {margin: -1px 0 0 -1px;border: 1px solid #BFBFBF}" +
    ".ace-pancake-light .ace_marker-layer .ace_active-line {background: #f5f5f5}" +
    ".ace-pancake-light .ace_gutter-active-line {background-color: #dcdcdc}" +
    ".ace-pancake-light .ace_marker-layer .ace_selected-word {border: 1px solid #BFBFBF}" +
    ".ace-pancake-light .ace_invisible {color: #BFBFBF}" +
    
    // Keywords and control structures - Soft Indigo
    ".ace-pancake-light .ace_keyword,.ace-pancake-light .ace_keyword.ace_control.ace_pancake {color: #ad8933ff;font-weight: 500}" +
    
    // Function keywords - Deep Blue  
    ".ace-pancake-light .ace_keyword.ace_function.ace_pancake {color: #1E40AF;font-weight: 500}" +
    
    // Annotation keywords - Warm Amber
    ".ace-pancake-light .ace_keyword.ace_annotation.ace_pancake {color: #D97706;font-weight: 500}" +
    
    // Constants and built-ins - Royal Blue
    ".ace-pancake-light .ace_constant.ace_language {color: #2563EB;font-weight: 500}" +
    
    // Numeric constants - Soft Purple
    ".ace-pancake-light .ace_constant.ace_numeric.ace_pancake {color: #3a93edff}" +
    
    // Function names - Emerald Green
    ".ace-pancake-light .ace_entity.ace_name.ace_function.ace_pancake {color: #087804ff;font-weight: 500}" +
    
    // Operators - Coral Red
    ".ace-pancake-light .ace_keyword.ace_operator.ace_assignment.ace_pancake,.ace-pancake-light .ace_keyword.ace_operator.ace_arithmetic.ace_pancake,.ace-pancake-light .ace_keyword.ace_operator.ace_logical.ace_pancake,.ace-pancake-light .ace_keyword.ace_operator.ace_bitwise.ace_pancake {color: #DC2626}" +
    
    // Shapes - Ocean Teal
    ".ace-pancake-light .ace_meta.ace_shape.ace_pancake {color: #0891B2}" +
    ".ace-pancake-light .ace_constant.ace_numeric.ace_shape.ace_pancake {color: #0E7490}" +
    
    // Annotations and specifications - Golden Brown
    ".ace-pancake-light .ace_punctuation.ace_definition.ace_specification.ace_begin.ace_pancake,.ace-pancake-light .ace_punctuation.ace_definition.ace_specification.ace_end.ace_pancake {color: #B45309;font-weight: 500}" +
    ".ace-pancake-light .ace_meta.ace_specification.ace_block.ace_pancake {color: #92400E}" +
    
    // Comments - Gray
    ".ace-pancake-light .ace_comment {color: #757575;font-style: italic}" +
    ".ace-pancake-light .ace_comment.ace_line.ace_double-slash.ace_pancake,.ace-pancake-light .ace_comment.ace_block.ace_pancake {color: #757575;font-style: italic}" +
    
    // Punctuation
    ".ace-pancake-light .ace_punctuation {color: #666666}" +
    
    // Strings (if you add them later)
    ".ace-pancake-light .ace_string {color: #2E7D32}" +
    
    // Invalid
    ".ace-pancake-light .ace_invalid {color: #ffffff;background-color: #F44336}" +
    ".ace-pancake-light .ace_invalid.ace_deprecated {color: #ffffff;background-color: #FF9800}" +
    
    // Fold
    ".ace-pancake-light .ace_fold {background-color: #4CAF50;border-color: #333333}" +
    
    // Indent guide
    ".ace-pancake-light .ace_indent-guide {background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYHB3d/8PAAOIAdULw8qMAAAAAElFTkSuQmCC) right repeat-y}";
    
    var r=e("../lib/dom");
    r.importCssString(t.cssText,t.cssClass);
});

(function() {
    window.require(["ace/theme/pancake_light"], function(m) {
        if (typeof module == "object" && typeof exports == "object" && module) {
            module.exports = m;
        }
    });
})();