// localStorage는 브라우저에 작은 정보를 저장하는 기능이야.
// 주의: 다른 기기나 다른 방문자와 글이 공유되지는 않아.
const STORAGE_KEY = 'tchaikop-lab-posts-v1';
const VIEWED_KEY = 'tchaikop-lab-viewed-v1';

function getUserPosts() {
  try {
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(posts) ? posts : [];
  } catch (error) { return []; }
}
function saveUserPosts(posts) { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); }
function getAllPosts() { return [...getUserPosts(), ...window.SEED_POSTS]; }
function findPost(id) { return getAllPosts().find(post => post.id === id); }
function isUserPost(id) { return getUserPosts().some(post => post.id === id); }
function formatDate(date) { return String(date).slice(0, 10).replaceAll('-', '.'); }
function makeElement(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text; // 사용자 입력은 HTML로 해석하지 않음(XSS 예방)
  return node;
}
function getViewedCounts() { try { return JSON.parse(localStorage.getItem(VIEWED_KEY) || '{}') || {}; } catch { return {}; } }

function renderBoard() {
  const list = document.getElementById('post-list');
  if (!list) return;
  const keyword = document.getElementById('search-input').value.trim().toLowerCase();
  const category = document.getElementById('category-filter').value;
  const posts = getAllPosts().filter(post => (category === 'ALL' || post.category === category) &&
    (`${post.title} ${post.body} ${post.author}`.toLowerCase().includes(keyword)));
  const counts = getViewedCounts();
  list.replaceChildren();
  document.getElementById('result-count').textContent = `${posts.length}개의 연구노트`;
  if (!posts.length) {
    list.append(makeElement('p', 'empty-state', '조건에 맞는 글이 없어. 다른 검색어를 입력해 봐.'));
    return;
  }
  posts.forEach(post => {
    const article = makeElement('article', 'post-row');
    const top = makeElement('div','post-row-top');
    top.append(makeElement('span', 'eyebrow', post.category));
    if (post.id.startsWith('demo-')) top.append(makeElement('span','demo-label','예시 글'));
    const a = makeElement('a', 'post-link', post.title);
    a.href = `view.html?id=${encodeURIComponent(post.id)}`;
    const desc = makeElement('p', 'post-excerpt', post.body.replace(/\s+/g, ' ').slice(0, 105) + '…');
    const meta = makeElement('div','post-meta', `${post.author}  ·  ${formatDate(post.date)}  ·  조회 ${counts[post.id] || 0}`);
    article.append(top, a, desc, meta);
    list.append(article);
  });
}
function initBoard() {
  if (!document.getElementById('post-list')) return;
  document.getElementById('search-input').addEventListener('input', renderBoard);
  document.getElementById('category-filter').addEventListener('change', renderBoard);
  renderBoard();
}
function initWrite() {
  const form = document.getElementById('write-form');
  if (!form) return;
  const editId = new URLSearchParams(location.search).get('edit');
  const old = editId && isUserPost(editId) ? findPost(editId) : null;
  if (old) {
    document.getElementById('form-title').textContent = '연구노트 수정';
    document.getElementById('submit-label').textContent = '수정 저장';
    form.elements.title.value = old.title;
    form.elements.category.value = old.category;
    form.elements.author.value = old.author;
    form.elements.body.value = old.body;
  }
  form.addEventListener('submit', event => {
    event.preventDefault(); // form 제출 시 새로고침 방지
    const title = form.elements.title.value.trim();
    const category = form.elements.category.value;
    const author = form.elements.author.value.trim();
    const body = form.elements.body.value.trim();
    if (!title || !author || !body || !category) { alert('모든 항목을 입력해 줘.'); return; }
    if (title.length > 120) { alert('제목은 120자 이내로 입력해 줘.'); return; }
    const posts = getUserPosts();
    let id;
    if (old) {
      id = old.id;
      const index = posts.findIndex(post => post.id === id);
      if (index < 0) return;
      posts[index] = {...posts[index], title, category, author, body};
    } else {
      id = `post-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
      posts.unshift({id,title,category,author,body,date:new Date().toISOString().slice(0,10),views:0});
    }
    try { saveUserPosts(posts); location.href = `view.html?id=${encodeURIComponent(id)}`; }
    catch { alert('브라우저 저장 공간을 확인해 줘.'); }
  });
}
function initView() {
  const area = document.getElementById('article-content');
  if (!area) return;
  const id = new URLSearchParams(location.search).get('id');
  const post = findPost(id);
  if (!post) {
    area.append(makeElement('p','empty-state','글을 찾을 수 없어. 게시판으로 돌아가 줘.'));
    return;
  }
  const views = getViewedCounts();
  views[post.id] = (views[post.id] || 0) + 1;
  try { localStorage.setItem(VIEWED_KEY, JSON.stringify(views)); } catch {}
  area.append(makeElement('span','eyebrow',post.category));
  if (post.id.startsWith('demo-')) area.append(makeElement('p','demo-notice','이 글은 사이트 시연을 위한 예시 콘텐츠야. 실제 방문자 작성 글이 아니야.'));
  area.append(makeElement('h1','article-title',post.title));
  area.append(makeElement('p','post-meta',`${post.author} · ${formatDate(post.date)} · 조회 ${views[post.id]}`));
  area.append(makeElement('div','article-body',post.body));
  const actions = document.getElementById('article-actions');
  if (isUserPost(id)) {
    const edit = makeElement('a','btn btn-outline','수정하기');
    edit.href = `write.html?edit=${encodeURIComponent(id)}`;
    const remove = makeElement('button','btn btn-danger','삭제하기');
    remove.type = 'button';
    remove.addEventListener('click', () => {
      if (!confirm('이 글을 삭제할까?')) return;
      saveUserPosts(getUserPosts().filter(p => p.id !== id));
      location.href = 'board.html';
    });
    actions.append(edit,remove);
  }
  const posts = getAllPosts();
  const index = posts.findIndex(p => p.id === id);
  const prev = posts[index-1], next = posts[index+1];
  const nav = document.getElementById('article-neighbors');
  [[prev,'이전 글'],[next,'다음 글']].forEach(([item,label]) => {
    if (!item) return;
    const link = makeElement('a','neighbor-link',`${label}  ·  ${item.title}`);
    link.href = `view.html?id=${encodeURIComponent(item.id)}`;
    nav.append(link);
  });
}
document.addEventListener('DOMContentLoaded', () => { initBoard(); initWrite(); initView(); });
