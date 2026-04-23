const AppState = {
  mockUser: {
    username: 'admin',
    password: 'password'
  },

  isLoggedIn() {
    return sessionStorage.getItem('loggedIn') === 'true';
  },
  login() {
    sessionStorage.setItem('loggedIn', 'true');
  },
  logout() {
    sessionStorage.removeItem('loggedIn');
  },

  tasks: [
    {
      id: 1,
      title: 'ログイン画面の実装',
      description: 'ID/パスワードのバリデーションを含む認証フォームを実装する',
      priority: 'HIGH',
      dueDate: '2026-05-01',
      column: 'TODO',
      position: 0
    },
    {
      id: 2,
      title: 'ボード画面のレイアウト作成',
      description: '3カラム構成のCSSグリッドを設計し、カード表示を実装する',
      priority: 'MEDIUM',
      dueDate: '2026-05-03',
      column: 'TODO',
      position: 1
    },
    {
      id: 3,
      title: 'ドラッグ&ドロップ機能の実装',
      description: 'Sortable.jsを使ってカラム間のカード移動を実装する',
      priority: 'MEDIUM',
      dueDate: '2026-05-10',
      column: 'IN_PROGRESS',
      position: 0
    },
    {
      id: 4,
      title: 'API設計書レビュー',
      description: 'REST APIエンドポイントの設計を確認・承認する',
      priority: 'LOW',
      dueDate: '2026-04-25',
      column: 'DONE',
      position: 0
    },
    {
      id: 5,
      title: '要件定義書の作成',
      description: '',
      priority: 'HIGH',
      dueDate: '2026-04-20',
      column: 'DONE',
      position: 1
    }
  ],

  getTasksByColumn(col) {
    return this.tasks
      .filter(t => t.column === col)
      .sort((a, b) => a.position - b.position);
  },

  getTaskById(id) {
    return this.tasks.find(t => t.id === id) || null;
  },

  addTask(taskData) {
    const col = taskData.column;
    const positions = this.tasks.filter(t => t.column === col).map(t => t.position);
    const maxPos = positions.length > 0 ? Math.max(...positions) : -1;
    this.tasks.push({ id: Date.now(), position: maxPos + 1, ...taskData });
  },

  updateTask(id, changes) {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx !== -1) Object.assign(this.tasks[idx], changes);
  },

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
  },

  reorderColumn(col, orderedIds) {
    orderedIds.forEach((id, i) => {
      this.updateTask(Number(id), { column: col, position: i });
    });
  }
};
