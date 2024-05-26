// 获取相关元素
const searchButton = document.getElementById('searchButton');
const searchModal = document.getElementById('searchModal');
const closeModal = document.getElementsByClassName('close')[0];

// 点击放大镜按钮，打开模态框
searchButton.onclick = function() {
    searchModal.style.display = 'block';
}

// 点击关闭按钮，关闭模态框
closeModal.onclick = function() {
    searchModal.style.display = 'none';
}

// 在窗口外点击，关闭模态框
window.onclick = function(event) {
    if (event.target == searchModal) {
        searchModal.style.display = 'none';
    }
}