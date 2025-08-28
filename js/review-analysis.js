// レビュー分析用のページ初期化スクリプト

// ページ管理オブジェクト
const ReviewAnalysis = function() {
    // 初期設定
    this.chartData = {
        labels: ['2023/1', '2023/2', '2023/3', '2023/4', '2023/5', '2023/6'],
        datasets: [
            {
                label: 'レビュー総数',
                data: [320, 380, 420, 380, 450, 510],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.3
            },
            {
                label: 'コメント総数',
                data: [1450, 1800, 2100, 1950, 2300, 2600],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.3
            },
            {
                label: '平均コメント数',
                data: [4.5, 4.7, 5.0, 5.1, 5.1, 5.1],
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.3
            }
        ]
    };
    
    this.commentsData = {
        labels: ['MUST', 'SHOULD', 'WANT', 'ナレッジ共有'],
        datasets: [{
            data: [28, 45, 15, 12],
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)'
            ],
            borderWidth: 1
        }]
    };
    
    this.reviewersData = {
        labels: ['A. 山田', 'B. 佐藤', 'C. 鈴木', 'D. 田中', 'E. 伊藤', 'その他'],
        datasets: [{
            label: 'レビュー数',
            data: [42, 38, 34, 29, 25, 68],
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
            borderWidth: 1
        }]
    };
    
    this.timelineData = {
        labels: ['2023/1', '2023/2', '2023/3', '2023/4', '2023/5', '2023/6'],
        datasets: [
            {
                label: 'レビュー時間平均',
                data: [85, 78, 92, 75, 68, 64],
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.3
            }
        ]
    };
};

// 初期化メソッド
ReviewAnalysis.prototype.init = function() {
    // チャートの初期化
    this.initCharts();
    
    // イベントリスナーの設定
        this.setupEventListeners();
    
    // データテーブルの初期化
    this.initDataTable();
    
    console.log('レビュー分析の初期化が完了しました');
};

// チャートの初期化
ReviewAnalysis.prototype.initCharts = function() {
    // メインチャート
    const mainChartCtx = document.getElementById('reviewChart').getContext('2d');
    new Chart(mainChartCtx, {
        type: 'line',
        data: this.chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // コメントタイプチャート
    const commentsChartCtx = document.getElementById('commentsChart').getContext('2d');
    new Chart(commentsChartCtx, {
        type: 'pie',
        data: this.commentsData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
    
    // レビュアー分布チャート
    const reviewersChartCtx = document.getElementById('reviewersChart').getContext('2d');
    new Chart(reviewersChartCtx, {
        type: 'bar',
        data: this.reviewersData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    // タイムラインチャート
    const timelineChartCtx = document.getElementById('timelineChart').getContext('2d');
    new Chart(timelineChartCtx, {
        type: 'line',
        data: this.timelineData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};

// イベントリスナーの設定
ReviewAnalysis.prototype.setupEventListeners = function() {
    const periodSelect = document.getElementById('periodSelect');
    if (periodSelect) {
        periodSelect.addEventListener('change', (e) => {
            this.updateChartByPeriod(e.target.value);
        });
    }
    
    const teamSelect = document.getElementById('teamSelect');
    if (teamSelect) {
        teamSelect.addEventListener('change', (e) => {
            this.updateChartByTeam(e.target.value);
        });
    }
    
    const projectSelect = document.getElementById('projectSelect');
    if (projectSelect) {
        projectSelect.addEventListener('change', (e) => {
            this.updateChartByProject(e.target.value);
        });
    }
};

// データテーブルの初期化
ReviewAnalysis.prototype.initDataTable = function() {
    const table = document.getElementById('reviewTable');
    if (table) {
        $(table).DataTable({
            paging: true,
            searching: true,
            ordering: true,
            info: true,
            pageLength: 10,
            language: {
                url: '//cdn.datatables.net/plug-ins/1.10.25/i18n/Japanese.json'
            }
        });
    }
};

// 期間によるチャート更新
ReviewAnalysis.prototype.updateChartByPeriod = function(period) {
    console.log(`期間が${period}に変更されました`);
    // ここで実際のデータ更新を行う
    // 例: APIからのデータ取得や、表示期間の変更など
};

// チームによるチャート更新
ReviewAnalysis.prototype.updateChartByTeam = function(team) {
    console.log(`チームが${team}に変更されました`);
    // ここで実際のデータ更新を行う
};

// プロジェクトによるチャート更新
ReviewAnalysis.prototype.updateChartByProject = function(project) {
    console.log(`プロジェクトが${project}に変更されました`);
    // ここで実際のデータ更新を行う
};

// ページの初期化処理（外部からの呼び出し用）
window.initializePage = function() {
    console.log('レビュー分析ページの初期化を開始します');
    const reviewAnalysis = new ReviewAnalysis();
    reviewAnalysis.init();
    
    // AIボタンのイベントリスナーを設定
    initializeAIButtons();
    
    console.log('レビュー分析ページの初期化完了');
};

// AIボタンの初期化
function initializeAIButtons() {
    console.log('レビュー分析ページ: AIボタンを初期化します');

    // ボタンを取得
    const aiButtons = document.querySelectorAll('.ai-button');
    console.log(`レビュー分析ページ: ${aiButtons.length}個のAIボタンが見つかりました`);
    
    if (aiButtons.length === 0) {
        console.warn('レビュー分析ページ: AIボタンが見つかりませんでした');
        return;
    }

    // すべてのボタンに対して既存のイベントリスナーをクリア
    aiButtons.forEach(button => {
        // クローンしてイベントリスナーを除去
        const newButton = button.cloneNode(true);
        if (button.parentNode) {
            button.parentNode.replaceChild(newButton, button);
            console.log('レビュー分析ページ: ボタンをクローンして置き換えました');
        } else {
            console.error('レビュー分析ページ: ボタンの親ノードが見つかりません');
        }
    });
    
    // 再度ボタンを取得してイベントリスナーを設定
    const refreshedButtons = document.querySelectorAll('.ai-button');
    console.log(`レビュー分析ページ: ${refreshedButtons.length}個の新しいAIボタンにイベントリスナーを設定します`);
    
    refreshedButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // ボタンのdata-context属性からコンテキストを取得
            const context = this.getAttribute('data-context') || 'review-summary';
            
            console.log('レビュー分析ページ: AIボタンがクリックされました。コンテキスト:', context);
            
            // FABManagerを直接呼び出す
            FABManager.openContextualHelp(context);
        });
    });
    
    console.log(`レビュー分析ページ: ${refreshedButtons.length}個のAIボタンにイベントリスナーを設定完了しました`);
}

// コンソールに読み込み完了メッセージを表示
console.log('レビュー分析ページのスクリプトがロードされました');