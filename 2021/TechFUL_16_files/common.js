/**
 * Get the URL parameter value
 *
 * @param  name {string} パラメータのキー文字列
 * @return  url {url} 対象のURL文字列（任意）
 */
function getParam(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const sendAsyncGetRequest = (url, param = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, param)
      .then((res) => {
        if (res.status == 200) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        // エラーごとの処理を記載
        alert("通信に失敗しました。もう一度画面読み込みを行ってください。");
        reject(err);
      });
  });
};

const sendAsyncPostRequest = (url, param = {}, token) => {
  const config = {
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json",
      "X-CSRFToken": token,
    },
    withCredentials: true,
  };
  return new Promise((resolve, reject) => {
    axios
      .post(url, param, config)
      .then((res) => {
        if (res.status == 200) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        // エラーごとの処理を記載
        alert("通信に失敗しました。もう一度画面読み込みを行ってください。");
        reject(err);
      });
  });
};

const loadTabs = (tabName, callback) => {
  callback()
  $('.nav-tabs a[href="' + tabName + '"]').tab("show");
};

