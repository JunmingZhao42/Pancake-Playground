// Define custom syntax highlighting for Pancake language
define("ace/mode/pancake_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (require, exports, module) {
  "use strict";

  var oop = require("ace/lib/oop");
  var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

  var PancakeHighlightRules = function () {
    this.$rules = {
      "start": [
        {
          token: "comment.line.double-slash.pancake",
          regex: "\\/\\/.*$"
          },
        {
          token: "comment.block.pancake",
          regex: "\\/\\*",
          next: "comment"
        },
        {
          token: "punctuation.definition.specification.begin.pancake",
          regex: "/@",
          push: "annotation"
        },
        {
          token: "constant.language",
          regex: "\\b@print|@biw|@base|true|false|Int|Ref|Bool\\b"
        },
        {
          token: "keyword.control.pancake",
          regex: "\\b(?:var|field|skip|stw|ldw|st8|ld8|st32|ld32|st|lds|if|else|while|break|continue|raise|return|tick|in|with|handle|!st8|!st32|!st16|ld16|goto|label|domain|axiom)\\b"
        },
        {
          token: "keyword.function.pancake",
          regex: "\\bfunction|fun|method|predicate\\b"
        },
        {
          token: "keyword.annotation.pancake",
          regex: "\\b(?:requires|ensures|assert|unfolding|in|retval|fold|unfold|unfolding|inhale|exhale|assume)\\b"
        },
        {
          token: "entity.name.function.pancake",
          regex: "\\b([a-zA-Z_]\\w*)(?=\\s*\\()"
        },
        {
          token: "meta.shape.pancake",
          regex: "\\{\\s*(?=\\d|\\{)",
          push: "shape"
        },
        {
          token: "constant.numeric.pancake",
          regex: "\\b\\d+\\b"
        },
        {
          token: "keyword.operator.assignment.pancake",
          regex: "="
        },
        {
          token: "keyword.operator.arithmetic.pancake",
          regex: "[+\\-*/]"
        },
        {
          token: "keyword.operator.logical.pancake",
          regex: "(?:&&|\\|\\||!)"
        },

        {
          token: "keyword.operator.bitwise.pancake",
          regex: "(?:&|\\||\\^|~|<<|>>)"
        },
      ],
      "comment": [
        {
          token: "comment.block.pancake",
          regex: "\\*/",
          next: "start"
        },
        {
          defaultToken: "comment.block.pancake"
        }
      ],
      "shape": [
        {
          token: "constant.numeric.shape.pancake",
          regex: "\\b\\d+\\b(?=\\s*[,}])"
        },
        {
          token: "meta.shape.pancake",
          regex: "\\{",
          push: "shape"
        },
        {
          token: "meta.shape.pancake",
          regex: "\\}",
          next: "pop"
        },
        { defaultToken: "meta.shape.pancake" }
      ],
      "annotation": [
        {
          token: "punctuation.definition.specification.end.pancake",
          regex: "@/",
          next: "pop"
        },
        { include: "start" },
        { defaultToken: "meta.specification.block.pancake" }
      ]
    };

    this.normalizeRules();
  };

  oop.inherits(PancakeHighlightRules, TextHighlightRules);
  exports.PancakeHighlightRules = PancakeHighlightRules;
});

define("ace/mode/matching_brace_outdent", ["require", "exports", "module", "ace/range"], function (require, exports, module) {
  "use strict";

  var Range = require("../range").Range;

  var MatchingBraceOutdent = function () { };

  (function () {
    this.checkOutdent = function (line, input) {
      if (! /^\s+$/.test(line))
        return false;

      return /^\s*\}/.test(input);
    };

    this.autoOutdent = function (doc, row) {
      var line = doc.getLine(row);
      var match = line.match(/^(\s*\})/);

      if (!match) return 0;

      var column = match[1].length;
      var openBracePos = doc.findMatchingBracket({ row: row, column: column });

      if (!openBracePos || openBracePos.row == row) return 0;

      var indent = this.$getIndent(doc.getLine(openBracePos.row));
      doc.replace(new Range(row, 0, row, column - 1), indent);
    };

    this.$getIndent = function (line) {
      return line.match(/^\s*/)[0];
    };
  }).call(MatchingBraceOutdent.prototype);

  exports.MatchingBraceOutdent = MatchingBraceOutdent;
});

define("ace/mode/pancake", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text",
  "ace/mode/pancake_highlight_rules", "ace/mode/matching_brace_outdent", "ace/mode/behaviour/cstyle"],
  function (require, exports, module) {
    "use strict";

    var oop = require("ace/lib/oop");
    var TextMode = require("ace/mode/text").Mode;
    var PancakeHighlightRules = require("ace/mode/pancake_highlight_rules").PancakeHighlightRules;
    var MatchingBraceOutdent = require("ace/mode/matching_brace_outdent").MatchingBraceOutdent;
    var CstyleBehaviour = require("ace/mode/behaviour/cstyle").CstyleBehaviour;

    var Mode = function () {
      this.HighlightRules = PancakeHighlightRules;
      this.$outdent = new MatchingBraceOutdent();
      this.$behaviour = new CstyleBehaviour();
    };

    oop.inherits(Mode, TextMode);

    (function () {
      this.lineCommentStart = "//";
      this.blockComment = { start: "/*", end: "*/" };

      this.getNextLineIndent = function (state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;
        var endState = tokenizedLine.state;

        if (tokens.length && tokens[tokens.length - 1].type == "comment") {
          return indent;
        }

        if (state == "start") {
          var match = line.match(/^.*[\{\(\[]\s*$/);
          if (match) {
            indent += tab;
          }
        }

        return indent;
      };

      this.checkOutdent = function (state, line, input) {
        return this.$outdent.checkOutdent(line, input);
      };

      this.autoOutdent = function (state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
      };

      this.$id = "ace/mode/pancake";
    }).call(Mode.prototype);

    exports.Mode = Mode;
  }
);