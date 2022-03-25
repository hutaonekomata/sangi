'use strict';

require.config({
    baseUrl: 'https://microsoft.github.io/monaco-editor/node_modules/monaco-editor/min/'
});

var editor = null,
    diffEditor = null;

    
const generateEditor = (code, language) => {

  if (!editor) {
    $('#editor').empty();
    editor = monaco.editor.create(document.getElementById('editor'), {
      fontSize: 16,
      model: null,
      minimap: {
        enabled: false
      }
    });
  };

  var oldModel = editor.getModel();
  // createModelの第一引数としてテキストを入れてあげるとエディタ上に表示できる
  var newModel = monaco.editor.createModel(code, language);
  
  editor.setModel(newModel);
  if (oldModel) {
    oldModel.dispose()
  };
  $('.loading.editor').fadeOut({
    duration: 300
  });
};



require(['vs/editor/editor.main'], function () {
  
  generateEditor(root.code, root.lang);
  
  monaco.editor.defineTheme('myTheme', {
    base: 'vs',
    inherit: true,
    rules: [{ background: 'EDF9FA' }],
    colors: {
      'editor.foreground': '#000000',
      'editor.background': '#FFFFFF',
      'editorCursor.foreground': '#8B0000',
      'editor.lineHighlightBackground': '#0000FF20',
      'editorLineNumber.foreground': '#008800',
      'editor.selectionBackground': '#88000030',
      'editor.inactiveSelectionBackground': '#88000015'
    }
  });

  
/*==================================
    学校用 制限された穴埋め問題用処理群
====================================*/
  if (!root.status) {
  
    updateEditorOptions(false);
      
      editor.onKeyDown((event) => {
        const { keyCode, ctrlKey, metaKey } = event;
        let line = editor.getPosition().lineNumber;
        let column = editor.getPosition().column;
        
        if (keyCode === 1 && column === 1) {
          updateEditorOptions(true);
          return;
        };
        
        // エンタークリックを無効化
        if (keyCode === 3) {
          event.preventDefault();
          return;
        };
        checkNumberRange(line, updateEditorOptions);
      });
        
      editor.onKeyUp((event) => {
        let line = editor.getPosition().lineNumber;
        checkNumberRange(line, updateEditorOptions);
      });
  
      editor.onDidChangeCursorPosition((event) => {
        let line = editor.getPosition().lineNumber;
        checkNumberRange(line, updateEditorOptions);
    })
  };

  // 問題作成画面の場合
  if (!root.problemType) {
    if (pageOne.is_sql) generateEditor(root.sql, root.dbLang);
    
    app.lines = editor.getModel().getLineCount();
    document.getElementById('code').innerHTML = editor.getValue();

    editor.onDidChangeModelContent(() => {
      app.lines = editor.getModel().getLineCount();
      document.getElementById('code').innerHTML = editor.getValue();
    });
  };
});

// Editor内の処理を１つ前に戻す（現在使ってない）
const undoEditor = (bool) => {
    if (bool) { editor.getModel().undo(); }
};

// 制限行内か、否かを判定する処理
const checkNumberRange = (line, callback) => {
    let bool = false;
    for (var item in root.lineInfo) {
        if (line >= root.lineInfo[item]['start'] && line <= root.lineInfo[item]['end']) {
            bool = true;
            break;
        }
    };
    callback(bool);
};


// readOnlyを付与したり、外したりする処理.
const updateEditorOptions = bool => {
  editor.updateOptions({
      readOnly: bool
  });
};

