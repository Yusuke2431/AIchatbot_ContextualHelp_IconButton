/**
 * 共通JavaScript機能
 * 全ページで使用される基本機能を提供
 */

// 共通DOM要素
let commonElements = {};

// ページ管理
const PageManager = {
    currentPage: 'devops',
    pageInitialized: false, // ページの初期化完了フラグ
    pages: {
        'devops': {
            title: 'DevOps分析',
            cssFile: 'css/devops.css',
            jsFile: 'js/devops.js'
        },
        'cycle-time': {
            title: 'サイクルタイム分析',
            cssFile: 'css/cycle-time.css',
            jsFile: 'js/cycle-time.js'
        },
        'team-summary': {
            title: 'チームサマリ',
            cssFile: 'css/team-summary.css',
            jsFile: 'js/team-summary.js'
        },
        'review': {
            title: 'レビュー分析',
            cssFile: 'css/review-analysis.css',
            jsFile: 'js/review-analysis.js'
        }
    },

    // ページ切り替え
    switchPage: function(pageId) {
        if (this.pages[pageId] && pageId !== this.currentPage) {
            this.loadPage(pageId);
            this.updateActiveMenu(pageId);
            this.updatePageTitle(pageId);
            this.currentPage = pageId;
        }
    },

    // ページコンテンツの読み込み
    loadPage: function(pageId) {
        const pageInfo = this.pages[pageId];
        
        // 初期化フラグをリセット
        this.pageInitialized = false;
        this.currentPage = pageId;
        console.log(`ページの読み込み開始: ${pageId}`);
        
        // 既存のページ固有CSSを削除
        this.removePageSpecificCSS();
        
        // 新しいページのCSSを読み込み
        this.loadCSS(pageInfo.cssFile);
        
        // ページコンテンツを読み込み
        this.loadPageContent(pageId);
        
        // ページ固有のJavaScriptを読み込み
        this.loadJS(pageInfo.jsFile);
    },

    // ページコンテンツの読み込み
    loadPageContent: function(pageId) {
        // ページIDとファイル名の対応
        const fileNameMap = {
            'review': 'review-analysis',
            'team-summary': 'team-summary'
        };
        const fileName = fileNameMap[pageId] || pageId;
        fetch(`pages/${fileName}.html`)
            .then(response => response.text())
            .then(html => {
                const mainContent = document.querySelector('.main-content');
                if (mainContent) {
                    // ダッシュボードヘッダーは保持し、その後のコンテンツのみ更新
                    const header = mainContent.querySelector('.dashboard-header');
                    mainContent.innerHTML = '';
                    if (header) {
                        mainContent.appendChild(header);
                    }
                    
                    // 新しいコンテンツを追加
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = html;
                    while (tempDiv.firstChild) {
                        mainContent.appendChild(tempDiv.firstChild);
                    }
                    
                    // コンテンツ追加後にDOMの安定を確認
                    console.log(`ページコンテンツが読み込まれました: ${pageId}`);
                }
            })
            .catch(error => {
                console.error(`Error loading page ${pageId}:`, error);
                this.showErrorMessage(`ページの読み込みに失敗しました: ${pageId}`);
            });
    },

    // CSSファイルの動的読み込み
    loadCSS: function(cssFile) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssFile;
        link.className = 'page-specific-css';
        document.head.appendChild(link);
    },

    // JavaScriptファイルの動的読み込み
    loadJS: function(jsFile) {
        // 既存のページ固有JSを削除
        this.removePageSpecificJS();
        
        const script = document.createElement('script');
        script.src = jsFile;
        script.className = 'page-specific-js';
        script.onload = () => {
            console.log(`Loaded: ${jsFile}`);
            
            // ディレイを追加してDOMの完全なロードを確保
            setTimeout(() => {
                // ページ固有の初期化関数があれば実行
                if (window.initializePage && typeof window.initializePage === 'function') {
                    console.log(`ページ固有の初期化関数を実行します: ${jsFile}`);
                    window.initializePage();
                    PageManager.pageInitialized = true;
                    console.log(`ページ初期化完了フラグを設定しました: ${PageManager.currentPage}`);
                }
            }, 200); // 200msのディレイを追加
        };
        script.onerror = () => {
            console.warn(`Failed to load: ${jsFile}`);
        };
        document.head.appendChild(script);
    },

    // ページ固有CSSの削除
    removePageSpecificCSS: function() {
        const pageCSS = document.querySelectorAll('.page-specific-css');
        pageCSS.forEach(css => css.remove());
    },

    // ページ固有JSの削除
    removePageSpecificJS: function() {
        const pageJS = document.querySelectorAll('.page-specific-js');
        pageJS.forEach(js => js.remove());
        console.log('ページ固有のJSファイルを削除しました');
        
        // ページ固有の初期化関数をクリア
        if (window.initializePage) {
            console.log('ページ固有の初期化関数をクリアします');
            window.initializePage = null;
        }
    },

    // アクティブメニューの更新
    updateActiveMenu: function(pageId) {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.classList.remove('active');
            if (item.id === pageId) {
                item.classList.add('active');
            }
        });
    },

    // ページタイトルの更新
    updatePageTitle: function(pageId) {
        const pageTitle = document.getElementById('page-title');
        if (pageTitle && this.pages[pageId]) {
            pageTitle.textContent = this.pages[pageId].title;
        }
    },

    // エラーメッセージの表示
    showErrorMessage: function(message) {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = `
                <div style="background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 16px; border-radius: 8px; margin: 20px 0;">
                    <strong>エラー:</strong> ${message}
                </div>
            `;
            mainContent.appendChild(errorDiv);
        }
    }
};

// FAB（Floating Action Button）管理
const FABManager = {
    fab: null,
    chatWindow: null,
    isOpen: false,
    currentContext: null,

    initialize: function() {
        this.fab = document.getElementById('fab');
        this.chatWindow = document.getElementById('chatWindow');
        
        if (this.fab) {
            this.fab.addEventListener('click', () => this.toggleChat());
        }

        const chatClose = document.getElementById('chatClose');
        if (chatClose) {
            chatClose.addEventListener('click', () => this.closeChat());
        }

        // Escキーでチャットを閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChat();
            }
        });
    },

    toggleChat: function() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    },

    openChat: function() {
        if (this.fab && this.chatWindow) {
            this.fab.style.display = 'none';
            this.chatWindow.classList.add('active');
            this.isOpen = true;
            
            // コンテキストが設定されていない場合も共通のインサイトモードインターフェースを使用
            if (!this.currentContext) {
                // デフォルトコンテキストを設定
                this.currentContext = 'default-context';
                this.updateContextInfo('default-context');
                
                // 標準のインサイト質問を設定
                const suggestionsSelect = document.querySelector('.suggestions-select');
                if (suggestionsSelect) {
                    suggestionsSelect.innerHTML = '<option value="">インサイトを選択してください</option>' +
                        '<option value="指標のサマリ">指標のサマリ</option>' +
                        '<option value="仮説とアクション">仮説とアクション</option>' +
                        '<option value="目標に対する進捗">目標に対する進捗</option>';
                }
                
                // 初期メッセージを設定
                const chatMessages = document.getElementById('chatMessages');
                if (chatMessages) {
                    chatMessages.innerHTML = `
                        <div class="bot-message">
                            <div class="message-avatar">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                                    <path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="2"/>
                                </svg>
                            </div>
                            <div class="message-content">
                                <p id="initialMessage">こんにちは！何かお手伝いできることはありますか？</p>
                                <div class="message-time">今</div>
                            </div>
                        </div>
                    `;
                }
            }
            
            // チャット入力にフォーカス
            setTimeout(() => {
                const chatInput = document.getElementById('chatInput');
                if (chatInput) {
                    chatInput.focus();
                }
            }, 100);
        }
    },

    closeChat: function() {
        if (this.fab && this.chatWindow) {
            this.chatWindow.classList.remove('active');
            this.fab.style.display = 'flex';
            this.isOpen = false;
            this.currentContext = null;
        }
    },

    // コンテキストヘルプからチャットを開く
    openContextualHelp: function(context) {
        this.currentContext = context;
        this.openChat();
        this.updateContextInfo(context);
        this.suggestContextualQuestions(context);
    },

    // コンテキスト情報の更新
    updateContextInfo: function(context) {
        const contextText = document.querySelector('.context-text');
        const chatTitle = document.getElementById('chatTitle');
        if (contextText && chatTitle) {
            const contextLabels = {
                // DevOps分析のコンテキスト
                'devops-trend': 'DevOps移動平均推移',
                'deploy-frequency': 'デプロイ頻度',
                'change-lead-time': '変更のリードタイム',
                'change-failure-rate': '変更障害率',
                'mean-time-to-recovery': '平均修復時間',
                
                // サイクルタイム分析のコンテキスト
                'cycle-time-summary': 'サイクルタイム平均値',
                'commit-to-open': 'コミットからオープンまでの平均時間',
                'open-to-review': 'オープンからレビューまでの平均時間',
                'review-to-approve': 'レビューからアプルーブまでの平均時間',
                'approve-to-merge': 'アプルーブからマージまでの平均時間',
                
                // チームサマリのコンテキスト
                'team-leadtime-summary': 'リードタイムサマリ',
                
                // レビュー分析のコンテキスト
                'review-summary': 'レビューサマリ',
                'review-total': 'レビュー総数',
                'review-comments-total': 'レビューコメント総数',
                'review-comments-average': 'レビューコメント平均数',
                
                // デフォルトコンテキスト
                'default-context': 'インサイト分析'
            };
            
            // コンテキストに対応するラベルがない場合は、デフォルトを使用
            const label = contextLabels[context] || 'インサイト分析';
            console.log(`コンテキスト情報を更新: ${context} => ${label}`);
            contextText.textContent = label;
            chatTitle.textContent = `${label} - チャット`;
        } else {
            console.error('コンテキスト情報の更新失敗: DOM要素が見つかりません');
        }
    },

    // コンテキストに応じた質問候補を提案
    suggestContextualQuestions: function(context) {
        const suggestionsSelect = document.querySelector('.suggestions-select');
        if (suggestionsSelect) {
            const suggestions = this.getContextSuggestions(context);
            suggestionsSelect.innerHTML = '<option value="">インサイトを選択してください</option>';
            suggestions.forEach((suggestion, index) => {
                const option = document.createElement('option');
                option.value = suggestion;
                option.textContent = suggestion;
                suggestionsSelect.appendChild(option);
            });
        }
    },

    // コンテキスト別の質問候補
    getContextSuggestions: function(context) {
        // すべてのコンテキストで共通の3つの質問候補を使用
        const commonSuggestions = [
            '指標のサマリ',
            '仮説とアクション',
            '目標に対する進捗'
        ];
        
        // すべてのコンテキストで共通の質問候補を返す
        return commonSuggestions;
    },
    
    // 標準質問カテゴリの取得
    getStandardQuestionCategories: function() {
        return [
            {
                id: 'metrics-summary',
                label: '指標のサマリ',
                question: 'このページの主要な指標について教えてください。'
            },
            {
                id: 'hypothesis-action',
                label: '仮説とアクション',
                question: 'この結果から考えられる仮説とアクションプランを教えてください。'
            },
            {
                id: 'goal-progress',
                label: '目標に対する進捗',
                question: '目標に対してどの程度進捗していますか？'
            }
        ];
    },

    // デフォルト状態にリセット
    resetToDefaultState: function() {
        // デフォルト状態もインサイトモードと共通化
        this.currentContext = 'default-context';
        this.updateContextInfo('default-context');
        
        const chatMessages = document.getElementById('chatMessages');
        const suggestionsSelect = document.querySelector('.suggestions-select');
        
        // チャットメッセージをクリアして初期メッセージを表示
        if (chatMessages) {
            chatMessages.innerHTML = `
                <div class="bot-message">
                    <div class="message-avatar">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                            <path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </div>
                    <div class="message-content">
                        <p id="initialMessage">こんにちは！何かお手伝いできることはありますか？</p>
                        <div class="message-time">今</div>
                    </div>
                </div>
            `;
        }
        
        // 質問選択肢を設定
        if (suggestionsSelect) {
            suggestionsSelect.innerHTML = '<option value="">インサイトを選択してください</option>' +
                '<option value="指標のサマリ">指標のサマリ</option>' +
                '<option value="仮説とアクション">仮説とアクション</option>' +
                '<option value="目標に対する進捗">目標に対する進捗</option>';
        }
    },
    
    // 質問カテゴリーをレンダリング
    renderQuestionCategories: function() {
        const categories = this.getStandardQuestionCategories();
        return `
            <div class="category-buttons">
                ${categories.map(category => `
                    <button class="category-button" data-question-id="${category.id}">
                        ${category.label}
                    </button>
                `).join('')}
            </div>
        `;
    },
    
    // 質問を送信
    sendQuestion: function(question) {
        // ユーザーメッセージをチャットに追加
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            // ユーザーメッセージを追加
            const userMessageHTML = `
                <div class="user-message">
                    <div class="message-avatar">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                            <path d="M12 12h.01M12 8v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div class="message-content">
                        <p>${question}</p>
                        <div class="message-time">今</div>
                    </div>
                </div>
            `;
            
            // カテゴリーボタンを削除
            const categoryButtonsDiv = chatMessages.querySelector('.question-categories');
            if (categoryButtonsDiv) {
                categoryButtonsDiv.remove();
            }
            
            chatMessages.insertAdjacentHTML('beforeend', userMessageHTML);
            
            // ボットの応答を追加
            setTimeout(() => {
                const botResponse = this.getBotResponse(question);
                const botMessageHTML = `
                    <div class="bot-message">
                        <div class="message-avatar">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                                <path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="2"/>
                            </svg>
                        </div>
                        <div class="message-content">
                            <p>${botResponse}</p>
                            <div class="message-time">今</div>
                        </div>
                    </div>
                `;
                chatMessages.insertAdjacentHTML('beforeend', botMessageHTML);
                
                // スクロールを最下部に移動
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 500);
            
            // スクロールを最下部に移動
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    },
    
    // ボットの応答を生成
    getBotResponse: function(question) {
        // 質問に基づいた応答を生成
        const responses = {
            'このページの主要な指標について教えてください。': 
                'このページでは主に以下の指標を確認できます：<br>' +
                '1. 平均サイクルタイム（プルリクエストがオープンからマージまでの平均時間）<br>' +
                '2. 平均デプロイ頻度（デプロイが行われる頻度）<br>' +
                '3. 失敗率（デプロイの失敗率）<br>' +
                'これらの指標は過去3ヶ月間のデータに基づいています。',
            
            'この結果から考えられる仮説とアクションプランを教えてください。': 
                '現在のデータから以下の仮説が考えられます：<br>' +
                '1. レビュー時間の増加がサイクルタイムの長期化につながっている<br>' +
                '2. プルリクエストのサイズが大きすぎるためレビューに時間がかかっている<br><br>' +
                '推奨アクション：<br>' +
                '・プルリクエストの粒度を小さくする<br>' +
                '・レビュープロセスの効率化<br>' +
                '・自動テストの強化',
            
            '目標に対してどの程度進捗していますか？': 
                '現在の進捗状況：<br>' +
                '・サイクルタイム目標：3日以内 → 現在：4.2日（目標達成率：71%）<br>' +
                '・デプロイ頻度目標：1日3回 → 現在：1日2.1回（目標達成率：70%）<br>' +
                '・失敗率目標：5%以下 → 現在：7.8%（目標達成率：64%）<br><br>' +
                '全体として目標達成に向けて進捗していますが、まだ改善の余地があります。'
        };
        
        return responses[question] || 
            'その質問についての詳細な情報はまだ準備中です。他にご質問はありますか？';
    }
};

// ユーティリティ関数
const Utils = {
    // デバウンス関数
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 数値フォーマット
    formatNumber: function(num, decimals = 1) {
        return num.toLocaleString('ja-JP', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },

    // 日付フォーマット
    formatDate: function(date, format = 'YYYY/MM/DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day);
    },

    // 要素の表示/非表示
    toggleElement: function(element, show) {
        if (element) {
            element.style.display = show ? 'block' : 'none';
        }
    },

    // 要素にクラスを追加/削除
    toggleClass: function(element, className, add) {
        if (element) {
            if (add) {
                element.classList.add(className);
            } else {
                element.classList.remove(className);
            }
        }
    }
};

// 初期化処理
document.addEventListener('DOMContentLoaded', function() {
    console.log('Common JavaScript initialized');
    
    // DOM要素の取得
    commonElements = {
        fab: document.getElementById('fab'),
        chatWindow: document.getElementById('chatWindow'),
        menuItems: document.querySelectorAll('.menu-item'),
        pageTitle: document.getElementById('page-title')
    };

    // メニューイベントリスナーの設定
    if (commonElements.menuItems) {
        commonElements.menuItems.forEach(item => {
            item.addEventListener('click', function() {
                PageManager.switchPage(this.id);
            });
        });
    }

    // FAB初期化
    FABManager.initialize();

    // 質問候補選択のイベントリスナー
    const suggestionsSelect = document.querySelector('.suggestions-select');
    if (suggestionsSelect) {
        // 初期選択肢の設定はここでは行わない（openChatとopenContextualHelpで設定）
        suggestionsSelect.addEventListener('change', function() {
            if (this.value) {
                const chatInput = document.getElementById('chatInput');
                if (chatInput) {
                    chatInput.value = this.value;
                    chatInput.focus();
                }
                // 選択した質問を送信
                FABManager.sendQuestion(this.value);
                this.selectedIndex = 0; // リセット
            }
        });
    }

    // 初期ページの読み込み（DevOps分析）
    PageManager.loadPage('devops');
});

// グローバルに公開
window.PageManager = PageManager;
window.FABManager = FABManager;
window.Utils = Utils;

// 共通のAIボタン初期化関数
window.initializeAIButtons = function() {
    // ページが初期化されていない場合は少し待つ
    if (!PageManager.pageInitialized) {
        console.log('共通関数: ページが初期化されていないため待機します');
        setTimeout(window.initializeAIButtons, 100);
        return;
    }
    
    // クリアするボタンの取得
    const allAIButtons = document.querySelectorAll('.ai-button');
    console.log(`共通関数: ${allAIButtons.length}個のAIボタンをクリアします`);
    
    if (allAIButtons.length === 0) {
        console.log('共通関数: AIボタンが見つかりませんでした');
        return;
    }
    
    // すべてのボタンに対して既存のイベントリスナーをクリア
    allAIButtons.forEach(button => {
        // クローンしてイベントリスナーを除去
        const newButton = button.cloneNode(true);
        if (button.parentNode) {
            button.parentNode.replaceChild(newButton, button);
        } else {
            console.error('共通関数: ボタンの親ノードが見つかりません');
        }
    });
    
    // 再度ボタンを取得してイベントリスナーを設定
    const refreshedButtons = document.querySelectorAll('.ai-button');
    console.log(`共通関数: ${refreshedButtons.length}個の新しいAIボタンにイベントリスナーを設定します`);
    
    // 各ページのデフォルトコンテキスト
    const pageContextDefaults = {
        'devops': 'devops-trend',
        'cycle-time': 'cycle-time-summary',
        'team-summary': 'team-leadtime-summary',
        'review': 'review-summary'
    };
    
    // 現在のページを取得
    const currentPage = PageManager.currentPage || 'devops';
    const defaultContext = pageContextDefaults[currentPage] || 'default-context';
    
    refreshedButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // ボタンのdata-context属性からコンテキストを取得
            const context = this.getAttribute('data-context') || defaultContext;
            
            console.log(`共通関数: AIボタンがクリックされました。コンテキスト: ${context}`);
            
            // チャットを開く
            FABManager.openContextualHelp(context);
        });
    });
    
    console.log(`共通関数: ${refreshedButtons.length}個のAIボタンのイベントリスナー設定が完了しました`);
};

// グローバル関数: コンテキストヘルプボタンから呼び出される
// 注意: 現在は各ページでFABManagerを直接呼び出しています
window.openContextualHelp = function(context) {
    console.log(`グローバル関数 openContextualHelp が呼び出されました。コンテキスト: ${context}`);
    // 必ずチャットボットを開く
    FABManager.openContextualHelp(context);
};
