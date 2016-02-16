/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	$(function () {
	  __webpack_require__(1);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(2);
	var Model = __webpack_require__(3);

	//view and render
	var els = {
	  win: $(window),
	  body: $('body'),

	  title: $('.main-title>header h1'),
	  searchForm: $('.search-form'),
	  searchInput: $('.search-form input'),
	  searchBtn: $('.search-form button.search'),
	  searchDropdownBtn: $('.search-form button.dropdown-toggle'),
	  searchDropdownMenu: $('.search-form .dropdown-menu'),
	  searchDropdownMenuTpl: $('.search-form .dropdown-menu script').html(),

	  searchRelate: $('.search-relate'),
	  searchRelateBd: $('.search-relate .bd'),
	  searchRelateTpl: $('.search-relate script').html(),

	  searchResult: $('.search-result'),
	  searchResultCt: $('.search-result .ct'),
	  searchResultTpl: $('.search-result script').html(),
	  searchResultHd: $('.search-result .hd'),
	  searchResultBd: $('.search-result .bd'),

	  variableMenuTpl: $('script[template="variableMenu"]').html(),

	  sourceCodeModal: $('.sourcecode-modal'),
	  sourceCodeModalDropdown: $('.sourcecode-modal .dropdown-menu'),
	  sourceCodeModalDropdownTpl: $('.sourcecode-modal .dropdown-menu script').html(),
	  sourceCodeContent: $('.sourcecode-modal .modal-body pre code'),
	  sourceCodeContentHd: $('.sourcecode-modal .modal-body .hd'),

	  bookmarkBtn: $('.bookmark-btn'),
	  bookmarkModal: $('.bookmark-modal'),
	  bookmarkModalTagMenu: $('.bookmark-modal .modal-header .tag-menu'),
	  bookmarkModalContent: $('.bookmark-modal .modal-body>.bd'),
	  bookmarkModalContentHd: $('.bookmark-modal .modal-body>.hd'),
	  bookmarkModalGroupTpl: $('.bookmark-modal script[data-template="repoGroup"]').html(),
	  bookmarkModalGroupItemTpl: $('.bookmark-modal script[data-template="groupItem"]').html(),
	  bookmarkModalTagItemTpl: $('.bookmark-modal script[data-template="tagItem"]').html(),
	  bookmarkModalTagDotTpl: $('.bookmark-modal script[data-template="tagDot"]').html(),
	  bookmarkModalReopTpl: $('.bookmark-modal script[data-template="repoItem"]').html(),

	  bookmarkUserModal: $('.bookmark-user-modal'),
	  bookmarkUserModalUserList: $('.bookmark-user-modal .user-list'),
	  bookmarkUserModalUserTpl: $('.bookmark-user-modal .user-list script').html(),

	  bookmarkGroupModal: $('.bookmark-group-modal'),
	  bookmarkGroupModalInput: $('.bookmark-group-modal input'),

	  confirmModal: $('.confirm-modal'),

	  githubCorner: $('.github-corner svg'),
	  donate: $('.donate'),
	  donateTitle: $('.donate .title'),

	  isGithub: /github/g.test(location.href),
	  lastVal: ''
	};

	function bindEvent() {
	  window.addEventListener('hashchange', onLocationHashChanged, false);
	  els.searchDropdownMenu.on('click', '.all', onResetLang);
	  els.searchDropdownMenu.on('change', 'input', onSelectLang);
	  els.searchInput.on('keyup', function () {
	    renderSearchBtn();
	  });
	  els.searchBtn.on('click', function () {
	    onSearch();
	  });
	  els.searchInput.keypress(function (e) {
	    if (e.which == 13) {
	      onSearch();
	      return false;
	    }
	  });
	  els.searchResultBd.on('click mouseenter', '.variable-wrap', function (e) {
	    e.preventDefault();
	    e.stopPropagation();
	    renderVariableMenu.call(this);
	    return false;
	  });
	  els.body.on('click', '.variable-btns__code', showSourceCode);
	  els.body.on('click', beforeRemoveVariableMenus);
	  els.sourceCodeModal.on('hidden.bs.modal', renderSourceCode);

	  //bookmark
	  els.win.on('DB:ready', renderBookmarkGroup);
	  els.win.on('DB:Table.RepoGroup.onchange', renderBookmarkGroup);
	  els.win.on('DB:Table.RepoTag.onchange', updateBookmarkTagsData);
	  els.bookmarkBtn.on('click', showBookmark);
	  els.bookmarkModalTagMenu.on('click', '.dropdown-item', renderBookmarkGroupByTag);
	  els.bookmarkModal.on('click', '.add-account', showBookmarkUserModal);
	  els.bookmarkModal.on('click', '.add-group', function(){
	    showBookmarkGroupModal();
	  });
	  els.bookmarkModalContentHd.on('click', '.submit', function(){
	    beforeAddBookmarkUser(els.bookmarkModalContentHd);
	  });
	  els.bookmarkModalContentHd.keypress(function (e) {
	    if (e.which == 13) {
	      beforeAddBookmarkUser(els.bookmarkModalContentHd);
	      return false;
	    }
	  });
	  els.bookmarkUserModal.keypress(function (e) {
	    if (e.which == 13) {
	      beforeAddBookmarkUser();
	      return false;
	    }
	  });
	  els.bookmarkGroupModal.on('click', '.submit', beforeEditBookmarkGroup);
	  els.bookmarkGroupModal.keypress(function (e) {
	    if (e.which == 13) {
	      beforeEditBookmarkGroup();
	      return false;
	    }
	  });
	  els.bookmarkModalContent.on('click', '.repo-group-item>.hd .ctrl .del', beforeDelBookmarkGroup);
	  els.bookmarkModalContent.on('click', '.repo-group-item>.hd .ctrl .edit', function(){
	    showBookmarkGroupModal(this.dataset.id,this.dataset.name);
	  });
	  els.bookmarkModalContent.on('click', '.group-menu .add-repo', beforeAddRepoToGroup);
	  els.bookmarkModalContent.on('click', '.tag-menu .add-repo', beforeAddRepoToTag);
	  els.bookmarkModalContent.on('click', '.repo-item .group-menu', renderBookmarkRepoGroupMenu);
	  els.bookmarkModalContent.on('click', '.repo-item .tag-menu', renderBookmarkRepoTagMenu);
	  els.bookmarkModalContent.on('mouseenter mouseleave ontouchstart ontouchend', '.repo-item', renderBookmarkRepoTagDots);
	  els.bookmarkModalContent.on('keyup','.repo-group-item>.hd .search input',renderBookmarkSearchRepos);
	  els.bookmarkModalContent.on('click','.repo-group-item>.hd .search submit',renderBookmarkSearchRepos);
	  els.bookmarkUserModal.on('click', '.submit', function(){
	    beforeAddBookmarkUser();
	  });
	  els.bookmarkUserModalUserList.on('click', '.sync', function () {
	    beforeSyncUser(this.dataset.name);
	  });
	  els.bookmarkUserModalUserList.on('click', '.del', beforeDelUser);
	  els.bookmarkGroupModal.on('hidden.bs.modal', showBookmark);
	  els.bookmarkUserModal.on('hidden.bs.modal', showBookmark);

	  els.confirmModal.on('click','.btn',hideConfirm);
	}

	function init() {
	  if (Util.os.ios || Util.os.android) {
	    els.isMobile = true;
	    els.body.addClass('mobile');
	    FastClick.attach(document.body);
	  }
	  bindEvent();
	  renderTitle();
	  renderBookmarkTip();
	  renderLangMunu();
	  onLocationHashChanged();
	  renderAnalytics();
	  //!els.isGithub && showBookmark();
	}

	function showSourceCode() {
	  renderSourceCode();
	  Model.searchcodeModel.requestSourceCode(this.dataset.id, renderSourceCode);
	  this.dataset.val && renderRelatedProperty(this.dataset.val);
	  els.sourceCodeModal.modal('show');
	}

	function showBookmark() {
	  renderBookmarkTip(true);
	  els.bookmarkModal.modal('show');
	  renderAnalytics('bk');
	}

	function showConfirm(msg,callback){
	  els.confirmModal.find('.modal-body').html(msg||'');
	  els.confirmModalYesCallback = callback;
	  els.confirmModal.show();
	  setTimeout(function(){
	    els.confirmModal.addClass('in');
	  },50);
	}
	function hideConfirm(){
	  els.confirmModal.removeClass('in');
	  setTimeout(function(){
	    els.confirmModal.hide();
	  },1000);
	  if($(this).hasClass('yes')){
	    els.confirmModalYesCallback && els.confirmModalYesCallback();
	  }
	  els.confirmModalYesCallback = null;
	}

	function hideBookmark() {
	  els.bookmarkModal.modal('hide');
	}

	function showBookmarkUserModal() {
	  hideBookmark();
	  els.bookmarkUserModal.modal('show');
	}

	function hideBookmarkUserModal() {
	  els.bookmarkUserModal.modal('hide');
	}

	function showBookmarkGroupModal(id,name) {
	  hideBookmark();
	  els.bookmarkGroupModal.modal('show');
	  if(id){
	    els.bookmarkGroupModalInput.attr('data-id',id).val(name||'');
	  }else{
	    els.bookmarkGroupModalInput.removeAttr('data-id').val('');
	  }
	}

	function hideBookmarkGroupModal() {
	  els.bookmarkGroupModal.modal('hide');
	}

	function onLocationHashChanged(e) {
	  e && e.preventDefault();
	  var hash = Util.HashHandler.get();
	  hash && onSearch(decodeURIComponent(hash).replace(/(\?.*)/, ''));
	}

	function onSelectLang() {
	  var checked = els.searchDropdownMenu.find('input:checked'), lang = [];
	  checked.each(function () {
	    lang.push(this.value);
	  });
	  Model.searchcodeModel.setLang(lang.join(' '));
	  renderSearchBtn('Search');
	}

	function onResetLang() {
	  els.searchDropdownMenu.find('input').removeAttr('checked');
	  Model.searchcodeModel.setLang();
	  renderSearchBtn('Search');
	}

	function onSearch(val) {
	  els.searchInput.blur();
	  beforeRemoveVariableMenus();
	  if (val && val == els.lastInputVal) {
	    return;
	  }
	  val = val || els.searchInput.val().trim();
	  els.searchInput.val(val);
	  els.valHistory = els.valHistory || '';
	  if (val.length) {
	    var isNext = val == els.lastInputVal;
	    els.lastInputVal = val;
	    if (!isNext) {
	      Util.HashHandler.set(encodeURIComponent(val));
	      var tmpval = [], tmpch = [];

	      els.lastInputVal.replace(/\s+/ig, '+').split('+').forEach(function (key) {
	        if (/[^\x00-\xff]/gi.test(key)) {
	          tmpch.push(key);
	          els.isZHSearchKeyWords = true;
	        } else {
	          tmpval.push(key);
	        }
	      });
	      els.lastVal = tmpval.join(' ');
	      if (tmpch.length) {
	        Model.youdaoTranslateModel.request(tmpch.join(' '), function (tdata) {
	          //basic translate
	          if (tdata.basic && tdata.basic.explains) {
	            els.valHistory = tdata.basic.explains.join(' ');
	          }
	          //web translate
	          if (tdata.web && tdata.web) {
	            tdata.web.forEach(function (key) {
	              els.valHistory += ' ' + key.value.join(' ');
	            });
	          }
	          if (tdata && tdata.translation) {
	            els.lastVal = els.lastVal + ' '
	              + tdata.translation.join(' ')
	                .replace(/[!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/g, '')
	                .split(' ').filter(function (key, idx, inputArray) {
	                  return inputArray.indexOf(key) == idx && !/^(a|an|the)$/ig.test(key);
	                }).join(' ');
	            beforeDoSearch();
	          } else {
	            beforeDoSearch();
	          }
	        });
	      } else {
	        beforeDoSearch();
	      }
	    } else {
	      doSearch();
	    }
	  }
	  renderTitle(true);
	}

	function beforeDoSearch() {
	  els.lastVal = els.lastVal.trim();
	  els.lastVal = els.lastVal.split(' ').filter(function (key, idx, inputArray) {
	    return inputArray.indexOf(key) == idx;
	  }).join(' ');
	  saveKeyWordRegs();
	  renderHistory();
	  doSearch();
	}

	function saveKeyWordRegs() {
	  els.valRegs = [];
	  els.lastVal.replace(/\s+/ig, '+').split('+').forEach(function (key) {
	    key.length && els.valRegs.push(Model.beanHelpersModel.getKeyWordReg(key));
	  });
	}

	function doSearch() {
	  if (els.lastVal && els.lastVal.length) {
	    Model.searchcodeModel.request(els.lastVal, renderSearchResult);
	    renderSearchResultHeader('loading');
	    renderSearchBtn();
	  } else {
	    renderSearchResultHeader('error');
	    renderSearchBtn('Search');
	  }

	  els.isGithub && Model.DDMSModel.postKeyWords(els.lastInputVal);
	  renderAnalytics('q=' + els.lastInputVal);
	}

	function renderTitle(black) {
	  els.title[black ? 'removeClass' : 'addClass']('animated');
	}

	function formatPropertyName(name) {
	  name = name.toLowerCase();
	  return '__codelf__' + name;
	}

	function storeRelatedProperty(name, res) {
	  name = formatPropertyName(name);
	  els.storeRelatedProperties = els.storeRelatedProperties || {};
	  if (!/\//g.test(name) /*exclude links*/ && name.length < 64 /*too long*/) {
	    var prop = els.storeRelatedProperties[name] = els.storeRelatedProperties[name] || {
	        ids: [],
	        repos: [],
	        repoNames: [],
	        repoFilePaths: [],
	        languages: []
	      };
	    if (!Util.isInArray(prop['ids'], res.id)) {
	      prop['ids'].push(res.id);
	      prop['repos'].push(res.repo);
	      prop['repoNames'].push(res.name);
	      prop['repoFilePaths'].push(res.repo+(res.location||'').substring(1)+'/'+res.filename);
	      prop['languages'].push(res.language);
	    }
	  }
	}

	function getRelatedProperty(name) {
	  name = formatPropertyName(name);
	  return els.storeRelatedProperties[name];
	}

	function getBookmarkRopeHtm(repo, allGroupHtm, allTagHtm) {
	  return els.bookmarkModalReopTpl
	    .replace(/\{id\}/g, repo.id)
	    .replace(/\{originRepoId\}/g, repo.originRepoId)
	    .replace(/\{full_name\}/g, repo.data.full_name)
	    .replace(/\{_full_name\}/g, repo.data.full_name.toLowerCase())
	    .replace(/\{description\}/g, repo.data.description||'')
	    .replace(/\{html_url\}/g, repo.data.html_url)
	    .replace(/\{groupItems\}/g, allGroupHtm)
	    .replace(/\{tagItems\}/g, allTagHtm)
	}

	function renderLangMunu() {
	  var htm = [], storeLang = Model.searchcodeModel.getLang();
	  storeLang = storeLang ? storeLang.split(' ') : [];
	  Model.topProgramLan.forEach(function (key) {
	    htm.push(els.searchDropdownMenuTpl
	      .replace('{id}', key.id)
	      .replace('{language}', key.language)
	      .replace('{checked}', $.inArray(key.id, storeLang) != -1 ? 'checked' : ''));
	  });
	  els.searchDropdownMenu.append(htm.join(''));
	}

	function renderSearchResult(data) {
	  var vals = [], labels = [], lineStr;
	  data.results.forEach(function (rkey) {
	    //filter codes
	    lineStr = [];
	    for (var lkey in rkey.lines) {
	      var lstr = rkey.lines[lkey];
	      //no base64
	      if (!(/;base64,/g.test(lstr) && lstr.length > 256)) {
	        lineStr.push(lstr);
	      }
	    }
	    lineStr = lineStr.join('').replace(/\r\n/g, ' ');
	    //match variables
	    els.valRegs.forEach(function (key) {
	      $.each(lineStr.match(key) || [], function (i, el) {
	        //remove "-" and "/" from the starer and the ender
	        el = el.replace(/^(\-|\/)*/, '').replace(/(\-|\/)*$/, '');
	        storeRelatedProperty(el, rkey);
	        if (
	          !/\//g.test(el) /*exclude links*/
	          && $.inArray(el, vals) === -1
	          && $.inArray(el.toLowerCase(), vals) === -1
	          && $.inArray(el.toUpperCase(), vals) === -1
	          && el.length < 64 /*too long*/
	        ) {
	          vals.push(el);
	          //render variable labels
	          labels.push(els.searchResultTpl
	            .replace('{label_type}', Model.beanHelpersModel.getRandomLabelType())
	            .replace(/\{val\}/g, el)
	            .replace('{id}', rkey.id)
	            .replace('{repo}', rkey.repo)
	          );
	        }
	      });
	    });
	  });

	  if (labels.length) {
	    var blockquote = els.searchResultBd.find('.blockquote');
	    if (blockquote[0]) {
	      els.searchResultBd.find('.blockquote').remove();
	    } else {
	      labels.push('<hr/>');
	    }
	    els.searchResultBd.prepend(labels.join(''));
	    els.searchResultCt.removeClass('ct--white');
	    renderSearchResultHeader();
	    renderTooltips();
	  } else {
	    renderSearchResultHeader('error');
	  }
	  renderTitle();
	  renderDonate();
	  renderBaiduShare();
	}

	function renderSearchBtn(str) {
	  var val = els.searchInput.val().trim();
	  els.searchBtn.removeClass('more').addClass((str || (val.length && val != els.lastInputVal)) ? '' : 'more');
	}

	function renderSearchResultHeader(cls) {
	  els.searchResultHd.removeClass('loading error').addClass(cls || '');
	}

	function renderVariableMenu() {
	  beforeRemoveVariableMenus();
	  $(this).popover({
	    trigger: 'manual',
	    html: true,
	    placement: 'top',
	    offset: '-10 0',
	    title: function () {
	      return false;
	    },
	    content: function () {
	      els.sourceCodeModal.find('.modal-header a.cur-repo').attr('href', this.dataset.repo);
	      var prop = getRelatedProperty(this.dataset.val);
	      return els.variableMenuTpl
	        .replace('{id}', this.dataset.id)
	        .replace('{count}', prop ? prop['ids'].length : 1)
	        .replace(/\{val\}/g, this.dataset.val)
	        .replace('{repo}', this.dataset.repo);
	    },
	    template: '<div class="popover popover--variable" role="tooltip">' +
	    '<div class="popover-arrow"></div><div class="popover-content"></div>' +
	    '</div>'
	  });
	  $(this).popover('show');
	  els.variableClipboard = new ZeroClipboard($('.variable-btns__copy')[0]);
	}

	function renderTooltips() {
	  els.showNextTipTimer = els.showNextTipTimer || 0;
	  var now = new Date().getTime();
	  if (now - els.showNextTipTimer > 1000 * 1800) {
	    els.showNextTipTimer = now;
	    els.searchBtn.tooltip('show');
	    setTimeout(function () {
	      els.searchBtn.tooltip('dispose');
	    }, 3000);
	  }
	}
	function renderBookmarkTip(dispose) {
	  if(dispose){
	    els.bookmarkBtn.tooltip('dispose');
	  }else{
	    setTimeout(function(){
	      els.bookmarkBtn.tooltip('show');
	      setTimeout(function(){
	        els.bookmarkBtn.tooltip('hide');
	      },2500);
	    },500);
	  }
	}

	function renderHistory() {
	  var his = [els.lastVal, els.valHistory], labels = [], tmp = [];
	  els.valHistory = his.join(' ')
	    .replace(/[`~!@#$^&*()=|{}':;',\[\].<>\/?~！@#￥……&*（）——|\\{\\}【】‘；：”“’。，、？]/g, ' ')
	    .replace(/\s+/ig, '+').split('+')
	    .filter(function (key, idx, inputArray) {
	      var checked = key.length > 1
	        && inputArray.indexOf(key) == idx
	        && !/[^\x00-\xff]/gi.test(key)
	        && !Util.isInArray(tmp, function (ikey) {
	          return new RegExp('^' + key + '$', 'ig').test(ikey)
	        });
	      if (checked) {
	        tmp.push(key);
	        labels.push(els.searchRelateTpl.replace(/\{val\}/g, key));
	      }
	      return checked;
	    })
	    .join(' ');
	  if (labels.length < 1) {
	    ['foo', 'bar', '2016'].forEach(function (key) {
	      labels.push(els.searchRelateTpl.replace(/\{val\}/g, key));
	    });
	  }
	  els.searchRelateBd.html('<span class="label label-default">Suggestions :</span>' + labels.join(''));
	}

	function renderSourceCode(data) {
	  els.sourceCodeContentHd.show();
	  els.sourceCodeContent.removeClass('prettyprinted').text('');
	  if (data && data.code) {
	    els.sourceCodeContentHd.hide();
	    els.sourceCodeContent.text(data.code);
	    setTimeout(function () {
	      PR.prettyPrint();
	    }, 100);
	    renderAnalytics('vc&q=' + els.lastInputVal);
	  }
	}

	function renderRelatedProperty(name) {
	  var htm = [],
	    prop = getRelatedProperty(name);
	  if (prop) {
	    var ids = prop['ids'],
	      repos = prop['repos'],
	      repoNames = prop['repoNames'],
	      repoFilePaths = prop['repoFilePaths'],
	      langs = prop['languages'],
	      i = 0, len = ids.length;
	    for (i; i < len; i++) {
	      htm.push(
	        els.sourceCodeModalDropdownTpl.replace(/\{id\}/g, ids[i])
	          .replace(/\{repo\}/g, repos[i])
	          .replace(/\{repoName\}/g, repoNames[i])
	          .replace(/\{repoFilePath\}/g, repoFilePaths[i])
	          .replace(/\{lang\}/g, langs[i])
	          .replace(/\{label_type\}/g, Model.beanHelpersModel.getRandomLabelType())
	      );
	    }
	  }
	  els.sourceCodeModalDropdown.html(htm.join(''));
	  els.sourceCodeModal.find('.match-count').html(htm.length);
	}

	function renderBookmarkHeader(cls){
	  els.bookmarkModalContentHd.removeClass('empty loading').addClass(cls||'');
	}

	function renderBookmarkGroup(data) {
	  if (!data || !data.repos || !data.users || !data.groups || !data.tags) {
	    Model.bookmarkModel.getAll(renderBookmarkGroup);
	    return;
	  }
	  var repos = Model.bookmarkModel.arrayToObj(data.repos,'originRepoId'),
	    htm = [],
	    allRepoHtm = [],
	    allGroupHtm = [],
	    allTagHtm = [];

	  data.groups.forEach(function (key) {
	    allGroupHtm.push(els.bookmarkModalGroupItemTpl
	      .replace(/\{id\}/g, key.id)
	      .replace(/\{name\}/g, key.name)
	    );
	  });
	  allGroupHtm = allGroupHtm.join('');
	  data.tags.forEach(function (key) {
	    allTagHtm.push(els.bookmarkModalTagItemTpl
	      .replace(/\{id\}/g, key.id)
	      .replace(/\{name\}/g, key.name)
	      .replace(/\{color\}/g, key.color)
	      .replace(/\{count\}/g, key.repoIds.length)
	    );
	  });
	  allTagHtm = allTagHtm.join('');
	  data.groups.forEach(function (key) {
	    var rids = /string/i.test(typeof key.repoIds)?key.repoIds.split(','):key.repoIds,
	      rhtm = [];
	    rids.length && rids.forEach(function (key) {
	      var rd = repos[key];
	      rd && rhtm.push(getBookmarkRopeHtm(rd, allGroupHtm, allTagHtm));
	    });
	    htm.push(els.bookmarkModalGroupTpl
	      .replace(/\{id\}/g, key.id)
	      .replace(/\{name\}/g, key.name)
	      .replace(/\{items\}/g, rhtm.join(''))
	      .replace(/\{itemCount\}/g, rhtm.length||'')
	    );
	  });
	  if(data.repos.length){
	    //add all group
	    data.repos.forEach(function (key) {
	      allRepoHtm.push(getBookmarkRopeHtm(key, allGroupHtm, allTagHtm));
	    });
	    htm.push(els.bookmarkModalGroupTpl
	      .replace(/\{id\}/g, 0)
	      .replace(/\{name\}/g, 'All')
	      .replace(/\{items\}/g, allRepoHtm.join(''))
	      .replace(/\{itemCount\}/g, data.repos.length)
	    );
	  }

	  if(data.repos.length || data.groups.length){
	    els.bookmarkModalContent.html(htm.join(''));
	    renderBookmarkHeader();
	  }else{
	    els.bookmarkModalContent.html('');
	    renderBookmarkHeader('empty');
	  }
	  setTimeout(function () {
	    els.bookmarkModalContent.find('.repo-group-item:last-child .collapse').addClass('in');
	  }, 100);

	  updateBookmarkGroupsData();
	  renderBookmarkTagMenu(allTagHtm);
	  renderBookmarkUsers(data.users);
	}

	function renderBookmarkGroupByTag(){
	  var id = this.dataset.id;
	  Model.bookmarkModel.getAll(function(data){
	    var repoObjs = Model.bookmarkModel.arrayToObj(data.repos,'originRepoId'),
	      repos = [],
	      repoIds;
	    if(id){
	      repoIds = data.tags.filter(function (key) {
	        return key.id == +id;
	      })[0].repoIds;
	      repoIds.forEach(function (key) {
	        repoObjs[key] && repos.push(repoObjs[key]);
	      });
	      data.repos = repos;
	    }
	    renderBookmarkGroup(data);
	  });
	}

	function renderBookmarkTagMenu(htm){
	  els.bookmarkModalTagMenu.find('.add-repo').remove();
	  els.bookmarkModalTagMenu.append(htm);
	  updateBookmarkTagsData();
	}

	function renderBookmarkRepoGroupMenu(){
	  var el = $(this),
	    id = el.parents('.repo-item').attr('data-repoid');
	  els.lastBookmarkGroupsData.forEach(function(key){
	    el.find('.add-repo[data-id="'+key.id+'"]')[key.repoIds.indexOf(id)==-1?'removeAttr':'attr']('data-selected',true);
	  });
	}

	function renderBookmarkRepoTagMenu(){
	  var el = $(this),
	    id = el.parents('.repo-item').attr('data-repoid');
	  els.lastBookmarkTagsData.forEach(function(key){
	    el.find('.add-repo[data-id="'+key.id+'"]')[key.repoIds.indexOf(id)==-1?'removeAttr':'attr']('data-selected',true);
	  });
	}
	function renderBookmarkRepoTagDots(e){
	  var el = $(this),
	    id = el.attr('data-repoid'),
	    dotsEl = el.find('.tag-dots'),
	    htm = [];
	  if(/ontouchstart|mouseenter/g.test(e.type)){
	    els.lastBookmarkTagsData.forEach(function(key){
	      if(key.repoIds.indexOf(id)!=-1){
	        htm.push(
	          els.bookmarkModalTagDotTpl
	            .replace(/\{color\}/g,key.color)
	        );
	      }
	    });
	    dotsEl.html(htm.join('')).addClass('in');
	  }else{
	    dotsEl.html('').removeClass('in');
	  }
	}

	function renderBookmarkSearchRepos(){
	  var gEl = els.bookmarkModalContent.find('.repo-group-item[data-id="0"]'),
	    inputEl = gEl.find('.hd .search input'),
	    countEl = gEl.find('.hd .count'),
	    val = inputEl.val().trim().toLowerCase(),
	    repoEls = gEl.find('.repo-list .repo-item'),
	    matchRepoEls = gEl.find('.repo-list .repo-item[data-name*="'+val+'"]'),
	    resultRepoEls = val.length?matchRepoEls:repoEls;

	  repoEls.attr('hidden','true');
	  resultRepoEls.removeAttr('hidden');
	  countEl.html(resultRepoEls.length);

	}
	function renderBookmarkUsers(data) {
	  var htm = [];
	  data.forEach(function (key) {
	    htm.push(els.bookmarkUserModalUserTpl
	      .replace(/\{id\}/g, key.id)
	      .replace(/\{name\}/g, key.name)
	    )
	  });
	  els.bookmarkUserModalUserList.html(htm.join(''));
	}

	function renderDonate(isZh) {
	  isZh = isZh || els.isZHSearchKeyWords;
	  els.donate.removeAttr('hidden');
	  els.donateTitle.removeClass('cn en').addClass(isZh ? 'cn' : 'en');
	}

	function renderAnalytics(param) {
	  els.isGithub && setTimeout(function () {
	    Util.Navigator.getFrame(null).setAttribute('src', 'http://www.mihtool.com/analytics.html?codelf' + (param ? ('&' + param) : ''));
	  }, param ? 500 : 3000);
	}

	function renderBaiduShare() {
	  if (els.hasBaiduShare || !els.isZHSearchKeyWords) {
	    return;
	  }
	  els.hasBaiduShare = true;
	  window._bd_share_config = {
	    "common": {
	      "bdSnsKey": {},
	      "bdText": "",
	      "bdMini": "2",
	      "bdMiniList": false,
	      "bdPic": "",
	      "bdStyle": "0",
	      "bdSize": "16"
	    }, "slide": {"type": "slide", "bdImg": "5", "bdPos": "right", "bdTop": els.win.height() / 2 - 80}
	  };

	  with (document)0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)];
	}

	function beforeRemoveVariableMenus() {
	  els.body.find('.popover--variable').remove();
	}

	function beforeAddBookmarkUser(el) {
	  el = el || els.bookmarkUserModal;
	  var inputEl = el.find('input'),
	    val = inputEl.val().trim();
	  val = val.replace(/(\/)*$/, '').replace(/^(.{0,}\/)/, '').replace(/@/g,'');
	  if (val.length) {
	    Model.bookmarkModel.setCurUserName(val);
	    Model.bookmarkModel.UserTable.add(val, function () {
	      beforeSyncUser(val);
	    });
	    els.isGithub && Model.DDMSModel.postBookmarkUser(val);
	    renderAnalytics('bk&u=' + val);
	  }
	  inputEl.val('');
	  hideBookmarkUserModal();
	}

	function beforeEditBookmarkGroup() {
	  var id = els.bookmarkGroupModalInput.attr('data-id'),
	    val = els.bookmarkGroupModalInput.val().trim();

	  if(val.length){
	    if(id){
	      Model.bookmarkModel.RepoGroupTable.updateName(id,val);
	      els.bookmarkGroupModalInput.removeAttr('data-id');
	    }else{
	      Model.bookmarkModel.RepoGroupTable.add(val);
	    }
	  }
	  els.bookmarkGroupModalInput.val('');
	  hideBookmarkGroupModal();
	}

	function beforeDelBookmarkGroup() {
	  var el = $(this),
	    id = el.attr('data-id');

	  showConfirm("Remove this group?",function(){
	    Model.bookmarkModel.RepoGroupTable.delete(id);
	  });
	}

	function beforeAddRepoToGroup() {
	  var el = $(this),
	    targetGroupId = el.attr('data-id'),
	    selected = el.attr('data-selected'),
	    repoEl = el.parents('.repo-item'),
	    repoId = repoEl.attr('data-repoid'),
	    repoUrl = repoEl.find('.repo-item__hd a').attr('href'),
	    curGroupEl = el.parents('.repo-group-item'),
	    curGroupId = curGroupEl.attr('data-id'),
	    curGroupElCountEl = curGroupEl.find('.hd>.count'),
	    curGoupCountNum = parseInt(curGroupElCountEl.html()||0),
	    targetGoupEl = curGroupEl.siblings('.repo-group-item[data-id="'+targetGroupId+'"]'),
	    targetGroupName = targetGoupEl.find('>.hd>a').html(),
	    targetGoupCountEl = targetGoupEl.find('.hd>.count'),
	    targetGoupCountNum = parseInt(targetGoupCountEl.html()||0),
	    targetGroupRepo = targetGoupEl.find('.repo-item[data-repoid="'+repoId+'"]');

	  if (!selected) {
	    Model.bookmarkModel.RepoGroupTable.addRopoId(targetGroupId, repoId);

	    if(!targetGroupRepo.length){
	      targetGoupCountEl.html(++targetGoupCountNum);
	      targetGoupEl.find('.repo-list').append(repoEl.clone());
	    }
	    els.isGithub && Model.DDMSModel.postBookmarkGroup(repoId,repoUrl,targetGroupName);

	  } else{
	    Model.bookmarkModel.RepoGroupTable.removeRopoId(targetGroupId, repoId);

	    if(targetGroupId==curGroupId){
	      repoEl.remove();
	      curGroupElCountEl.html(--curGoupCountNum||'');
	    }else{
	      targetGroupRepo.remove();
	      targetGoupCountEl.html(--targetGoupCountNum||'');
	    }
	  }
	}
	function beforeAddRepoToTag() {
	  var el = $(this),
	    targetId = el.attr('data-id'),
	    selected = el.attr('data-selected'),
	    repoEl = el.parents('.repo-item'),
	    repoId = repoEl.attr('data-repoid');

	  if (targetId != undefined && targetId != 0){
	    Model.bookmarkModel.RepoTagTable[selected?'removeRopoId':'addRopoId'](targetId, repoId);
	  }
	}

	function beforeSyncUser(name) {
	  if (name) {
	    renderBookmarkHeader('loading');
	    Model.bookmarkModel.setCurUserName(name);
	    Model.bookmarkModel.syncGithub(function () {
	      Model.bookmarkModel.getAll(renderBookmarkGroup);
	    });
	  }
	}

	function beforeDelUser() {
	  var el = $(this),
	    id = el.attr('data-id');

	  showConfirm("Remove this user and all repos for the user?",function(){
	    Model.bookmarkModel.UserTable.delete(id, function () {
	      el.parents('.user-item').remove();
	      Model.bookmarkModel.getAll(renderBookmarkGroup);
	    });
	  });
	}

	function updateBookmarkTagsData(){
	  Model.bookmarkModel.RepoTagTable.getAll(function(res){
	    els.lastBookmarkTagsData = res;
	  });
	}
	function updateBookmarkGroupsData(){
	  Model.bookmarkModel.RepoGroupTable.getAll(function(res){
	    els.lastBookmarkGroupsData = res;
	  });
	}

	init();


/***/ },
/* 2 */
/***/ function(module, exports) {

	//utils
	var appCache = window.applicationCache;
	appCache.addEventListener('updateready', function(e) {
	  if (appCache.status == appCache.UPDATEREADY){
	    try{
	      appCache.update();
	      if (appCache.status == appCache.UPDATEREADY) {
	        try{
	          appCache.swapCache();
	          window.location.reload(false);
	        }catch(err){}
	      }
	    }catch(err){}
	  }
	}, false);

	var ua = navigator.userAgent,
	  android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
	  ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
	  ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
	  iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
	  os = {};

	if (android) os.android = true, os.version = android[2];
	if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
	if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
	if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
	exports.os = os;

	var localStorage = new function () {
	  var lcst = window.localStorage;

	  function getLocalValue(id) {
	    if (lcst) {
	      return lcst[id];
	    } else {
	      return null;
	    }
	  }

	  function setLocalValue(id, val) {
	    if (lcst) {
	      if (typeof id === 'object') {
	        for (var key in id) {
	          try {
	            id[key] && lcst.setItem(key, id[key]);
	          } catch (err) {
	          }
	        }
	      } else {
	        try {
	          lcst.setItem(id, val);
	        } catch (err) {
	        }
	      }
	    }
	    return this;
	  }

	  function removeLocalValue(id) {
	    if (lcst) {
	      if (typeof id === 'object') {
	        for (var key in id) {
	          try {
	            lcst.removeItem(id[key]);
	          } catch (err) {
	          }
	        }
	      } else {
	        try {
	          lcst.removeItem(id);
	        } catch (err) {
	        }
	      }
	    }
	    return this;
	  }

	  this.set = setLocalValue;
	  this.get = getLocalValue;
	  this.del = removeLocalValue;
	};
	exports.localStorage = localStorage;

	var HashHandler = (function () {
	  var lc = window.location;

	  function getByURL(url) {
	    var hash;
	    url && decodeURIComponent(url).replace(new RegExp('#(.*)', 'g'), function ($1, $2) {
	      hash = $2;
	    });
	    return hash;
	  }

	  function get() {
	    return getByURL(lc.hash);
	  }

	  function set(hash) {
	    lc.hash = hash;
	  }

	  return {
	    get: get,
	    set: set,
	    getByURL: getByURL
	  }
	})();
	exports.HashHandler = HashHandler;

	var Navigator = (function () {
	  var frame,
	    androidReg = /Android/gi,
	    isAndroid = androidReg.test(navigator.platform) || androidReg.test(navigator.userAgent);
	  frame = null;
	  function appendFrame(frame) {
	    frame && document.body.appendChild(frame);
	  }

	  function removeFrame(frame) {
	    frame && frame.parentNode.removeChild(frame);
	  }

	  function getFrame(src, name) {
	    var _frame = document.createElement("iframe");
	    _frame.setAttribute("style", "display:none;width:0;height:0;position: absolute;top:0;left:0;border:0;");
	    _frame.setAttribute("height", "0px");
	    _frame.setAttribute("width", "0px");
	    _frame.setAttribute("frameborder", "0");
	    name && _frame.setAttribute("name", name);
	    if (src) {
	      _frame.setAttribute("src", src);
	    } else {
	      appendFrame(_frame);
	    }
	    return _frame;
	  }

	  function protocol(command, single, noframe) {
	    var _frame, timer;
	    if (noframe) {
	      window.location.href = command;
	      return;
	    }
	    if (single) {
	      if (isAndroid) {
	        _frame = getFrame();
	        _frame.setAttribute("src", command);
	      } else {
	        _frame = getFrame(command);
	        appendFrame(_frame);
	      }
	      timer = setTimeout(function () {
	        _frame && removeFrame(_frame);
	      }, 30000);
	      _frame.onload = _frame.onreadystatechange = function () {
	        timer && clearTimeout(timer);
	        _frame && removeFrame(_frame);
	      }
	    } else {
	      frame = frame || getFrame();
	      frame.setAttribute("src", command);
	    }
	  }

	  return {
	    protocol: protocol,
	    getFrame: getFrame,
	    appendFrame: appendFrame,
	    removeFrame: removeFrame
	  }
	})();
	exports.Navigator = Navigator;

	var FormHandler = new function () {
	  function getForm(method) {
	    var _form = document.createElement('form');
	    _form.setAttribute("style", "display:none;width:0;height:0;position: absolute;top:0;left:0;border:0;");
	    _form.setAttribute("method", method || 'POST');
	    return _form;
	  }

	  this.asyncSubmit = function (action, data) {
	    this.submit(action, data, true);
	  }

	  this.submit = function (action, data, async) {
	    var target,
	      frame,
	      form = getForm(),
	      inputs = [],
	      itpl = '<input type="text" name="{N}" value="{V}" />';

	    if (async) {
	      target = '__formhandler_' + new Date().getTime();
	      frame = Navigator.getFrame(null, target);
	      form.setAttribute('target', target);
	      setTimeout(function () {
	        Navigator.removeFrame(frame);
	      }, 120000);
	    }

	    form.setAttribute('action', action);
	    data = data || {};
	    for (var key in data) {
	      inputs.push(itpl.replace('{N}', key).replace('{V}', data[key]));
	    }
	    form.innerHTML = inputs.join('');
	    action && setTimeout(function () {
	      form.submit();
	    }, 100);
	  }
	};
	exports.FormHandler = FormHandler;

	function randomColor() {
	  var letters = '0123456789ABCDEF'.split('');
	  var color = '#';
	  for (var i = 0; i < 6; i++) {
	    color += letters[Math.floor(Math.random() * 16)];
	  }
	  return color;
	}
	exports.randomColor = randomColor;

	function randomList(list, len, verify, ratio) {
	  var rs = [], _list = list.slice(0);
	  len = len || _list.length;
	  ratio = ratio ? ratio : 0;
	  function rd(_array) {
	    _array = _array.sort(function () {
	      return (0.5 - Math.random());
	    });
	  }

	  while (ratio) {
	    rd(_list);
	    ratio--;
	  }
	  if (_list.length <= len) {
	    rs = _list;
	  } else {
	    while (rs.length < len) {
	      var index = Math.floor(Math.random() * _list.length),
	        item = _list[index];
	      if (( verify && verify.call(this, item, _list) ) || !verify) {
	        rs.push(item);
	        _list.splice(index, 1);
	      }
	    }
	  }
	  return rs;
	}
	exports.randomList = randomList;

	function isInArray(arr, val) {
	  if ($.inArray(val, arr) != -1) {
	    return true;
	  }
	  for (var key in arr) {
	    if (typeof val === 'function' && val.call(this, arr[key])) {
	      return true;
	    }
	  }
	  return false;
	}
	exports.isInArray = isInArray;

	//end utils



/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(2);

	//model
	//http://githut.info/
	var topProgramLan = [{"id": "22,106", "language": "JavaScript, CoffeeScript"}, {
	  "id": "133,135",
	  "language": "CSS"
	}, {"id": "3,39", "language": "HTML"}, {"id": 137, "language": "Swift"}, {
	  "id": 35,
	  "language": "Objective-C"
	}, {"id": 23, "language": "Java"}, {"id": 19, "language": "Python"}, {"id": 24, "language": "PHP"}, {
	  "id": 32,
	  "language": "Ruby"
	}, {"id": 28, "language": "C"}, {"id": 16, "language": "C++"}, {"id": 6, "language": "C#"}, {
	  "id": 55,
	  "language": "Go"
	}, {"id": 51, "language": "Perl"}, {"id": "104,109", "language": "Clojure, ClojureScript"}, {
	  "id": 40,
	  "language": "Haskell"
	}, {"id": 54, "language": "Lua"}, {"id": 20, "language": "Matlab"}, {"id": 144, "language": "R"}, {
	  "id": 47,
	  "language": "Scala"
	}, {"id": "69,78,146", "language": "Shell"}, {"id": 29, "language": "Lisp"}, {"id": 42, "language": "ActionScript"}];
	exports.topProgramLan = topProgramLan;
	var searchcodeModel = new function () {
	  var persistLangsName = 'codelf_langs_selected';
	  var langs = Util.localStorage.get(persistLangsName), langQuery;
	  var page = 0;
	  var lastVal;
	  var cacheSourceCodes = {};
	  var afterRequestSearchcode;

	  genLangQuery(langs);

	  this.resetPage = function () {
	    page = 0;
	  }

	  this.setLang = function (val) {
	    langs = val || null;
	    genLangQuery(val);
	    this.resetPage();
	    Util.localStorage[langs ? 'set' : 'del'](persistLangsName, langs);
	  }

	  this.getLang = function () {
	    return langs;
	  }

	  function genLangQuery(val) {
	    if (!!val) {
	      var arr1 = val.replace(/\s+/g, ',').split(','),
	        arr2 = [];
	      arr1.forEach(function (key) {
	        arr2.push('lan=' + key);
	      });
	      langQuery = arr2.join('&');
	    } else {
	      langQuery = null;
	    }
	  }

	  //search code by query
	  this.request = function (val, callback) {
	    afterRequestSearchcode = callback;
	    if (val != lastVal) {
	      this.resetPage();
	    }
	    lastVal = val;
	    lastVal && $.ajax({
	      type: 'GET',
	      //dataType: 'jsonp',
	      dataType: 'json',
	      url: 'https://searchcode.com/api/codesearch_I/' + (langQuery ? ('?' + langQuery) : ''),
	      //url: 'https://searchcode.com/api/jsonp_codesearch_I/' + (langQuery ? ('?' + langQuery) : ''),
	      data: {
	        q: lastVal,
	        p: page,
	        per_page: 42,
	        callback: 'afterRequestSearchcode'
	      },
	      jsonp: false,
	      jsonpCallback: false,
	      success: function (data) {
	        callback && callback(data, page);
	        page++;
	      }
	    })
	  };

	  window.afterRequestSearchcode = function(data){
	    afterRequestSearchcode && afterRequestSearchcode(data, page);
	    page++;
	  }

	  //get source code by id
	  this.requestSourceCode = function (id, callback) {
	    if (cacheSourceCodes[id]) {
	      callback && callback(cacheSourceCodes[id]);
	      return;
	    }
	    id && $.ajax({
	      type: 'GET',
	      dataType: 'json',
	      url: 'https://searchcode.com/api/result/' + id + '/',
	      success: function (data) {
	        cacheSourceCodes[id] = data;
	        callback && callback(data);
	      }
	    });
	  }
	};
	exports.searchcodeModel = searchcodeModel;

	var youdaoTranslateModel = new function () {
	  var lastVal;
	  var translateRequestCallback;
	  this.request = function (val, callback) {
	    lastVal = val;
	    translateRequestCallback = callback;
	    lastVal && $.ajax({
	      type: 'GET',
	      url: 'http://fanyi.youdao.com/openapi.do?keyfrom=Codelf&key=2023743559&type=data&doctype=jsonp&version=1.1',
	      dataType: 'jsonp',
	      jsonp: false,
	      jsonpCallback: false,
	      contentType: "application/json",
	      data: {
	        q: lastVal,
	        callback: 'afterYoudaoTranslateRequest'
	      }
	    });
	  }
	  window.afterYoudaoTranslateRequest = function (data) {
	    if (data) {
	      translateRequestCallback && translateRequestCallback(data);
	    }
	  }
	};
	exports.youdaoTranslateModel = youdaoTranslateModel;

	var DDMSModel = new function () {
	  var postAction = 'http://ddmsapi.mihtool.com/apis/v1/formdata/';
	  var persistKeyWordsName = 'codelf_ddms_keywords';
	  var persistKeyWordsTimerName = persistKeyWordsName + '_timer';
	  var cacheKeyWords = (Util.localStorage.get(persistKeyWordsName) || '').split(',');
	  var ot = new Date(Util.localStorage.get(persistKeyWordsTimerName) || 0);
	  var nt = new Date().getTime();

	  if ((nt - ot) > 1000 * 60 * 60 * 24) {
	    cacheKeyWords = [];
	    Util.localStorage.set(persistKeyWordsTimerName, nt);
	  }
	  function saveKeyWords(val) {
	    if (!Util.isInArray(cacheKeyWords, val)) {
	      cacheKeyWords.push(val);
	      Util.localStorage.set(persistKeyWordsName, cacheKeyWords.join(',').replace(/^,*/g, '').replace(/,*&/g, ''));
	    }
	  }

	  this.postKeyWords = function (val) {
	    if (val && !Util.isInArray(cacheKeyWords, val)) {
	      Util.FormHandler.asyncSubmit(postAction, {
	        formid: '567ff8b0e454ee154de533dd',
	        keywrod: val
	      });
	      saveKeyWords(val);
	    }
	  }
	  this.postBookmarkUser = function (val) {
	    if (val) {
	      Util.FormHandler.asyncSubmit(postAction, {
	        formid: '569c3740b6691c4e16fc9999',
	        account: val
	      });
	    }
	  }
	  this.postBookmarkGroup = function (repoid,repourl,groupname) {
	    if (repoid) {
	      Util.FormHandler.asyncSubmit(postAction, {
	        formid: '56a1a23fb6691c4e16fc99b8',
	        repoid: repoid,
	        repourl: repourl,
	        groupname: groupname,
	      });
	    }
	  }
	};
	exports.DDMSModel = DDMSModel;

	var bookmarkModel = new function () {
	  var BM = this;
	  var DB;
	  var schemaBuilder = lf.schema.create('Codelf', 2);
	  var Tables;
	  var DBEventType = {
	    C: 'CREATE',
	    U: 'UPDATED',
	    D: 'DELETE'
	  };
	  var win = $(window);
	  var curUserName;
	  var curUser;

	  schemaBuilder
	    .createTable('User')
	    .addColumn('id', lf.Type.INTEGER)
	    .addColumn('name', lf.Type.STRING)
	    .addColumn('create', lf.Type.DATE_TIME)
	    .addColumn('lastSync', lf.Type.DATE_TIME)
	    .addPrimaryKey(['id'], true);

	  schemaBuilder
	    .createTable('RepoGroup')
	    .addColumn('id', lf.Type.INTEGER)
	    .addColumn('name', lf.Type.STRING)
	    .addColumn('repoIds', lf.Type.OBJECT)
	    .addColumn('order', lf.Type.INTEGER)
	    .addColumn('create', lf.Type.DATE_TIME)
	    .addPrimaryKey(['id'], true);

	  schemaBuilder
	    .createTable('Repo')
	    .addColumn('id', lf.Type.INTEGER)
	    .addColumn('userId', lf.Type.INTEGER)
	    .addColumn('originRepoId', lf.Type.STRING)
	    .addColumn('data', lf.Type.OBJECT)
	    .addColumn('create', lf.Type.DATE_TIME)
	    .addPrimaryKey(['id'], true);

	  schemaBuilder
	    .createTable('RepoTag')
	    .addColumn('id', lf.Type.INTEGER)
	    .addColumn('name', lf.Type.STRING)
	    .addColumn('color', lf.Type.STRING)
	    .addColumn('repoIds', lf.Type.OBJECT)
	    .addColumn('create', lf.Type.DATE_TIME)
	    .addPrimaryKey(['id'], true);

	  schemaBuilder.connect({
	    storeType: Util.os.ios?lf.schema.DataStoreType.WEB_SQL: null
	  }).then(function (db) {
	    DB = db;
	    Tables = {
	      User: DB.getSchema().table('User'),
	      RepoGroup: DB.getSchema().table('RepoGroup'),
	      RepoTag: DB.getSchema().table('RepoTag'),
	      Repo: DB.getSchema().table('Repo')
	    };
	    BM.RepoTagTable.addDefaultTags();
	    win.trigger('DB:ready');
	  });

	  this.UserTable = new function () {
	    this.add = function (name, callback) {
	      if (!name) {
	        return;
	      }
	      var row = Tables.User.createRow({
	        'name': name,
	        'create': new Date(),
	        'lastSync': new Date()
	      });
	      DB.select().from(Tables.User).where(Tables.User.name.eq(name))
	        .exec().then(function (rows) {
	        !rows.length && DB.insertOrReplace().into(Tables.User).values([row])
	          .exec().then(function (res) {
	            curUser = res[0];
	            callback && callback();
	            win.trigger('DB:Table.User.onchange', {type: DBEventType.C});
	          });
	      });
	    }

	    this.updateSync = function (name) {
	      DB.update(Tables.User).set(Tables.User.lastSync, new Date()).where(Tables.User.name.eq(name))
	        .exec().then(function () {
	        win.trigger('DB:Table.User.onchange', {type: DBEventType.U});
	      });
	    }

	    this.delete = function (id, callback) {
	      DB.delete()
	        .from(Tables.Repo)
	        .where(Tables.Repo.userId.eq(id))
	        .exec().then(function () {
	        DB.delete()
	          .from(Tables.User)
	          .where(Tables.User.id.eq(id))
	          .exec().then(function (res) {
	          callback && callback(res);
	          win.trigger('DB:Table.User.onchange', {type: DBEventType.D});
	        });
	      });
	    }

	    this.getAll = function (callback) {
	      DB.select()
	        .from(Tables.User)
	        .orderBy(Tables.User.create, lf.Order.DESC)
	        .exec().then(function (rows) {
	        callback && callback(rows);
	      });
	    }
	  };

	  this.RepoGroupTable = new function () {
	    this.add = function (name) {
	      if (!name) {
	        return;
	      }
	      var row = Tables.RepoGroup.createRow({
	        'name': name,
	        'repoIds': [],
	        'order': 0,
	        'create': new Date()
	      });
	      DB.select().from(Tables.RepoGroup).where(Tables.RepoGroup.name.eq(name))
	        .exec().then(function (rows) {
	        !rows.length && DB.insertOrReplace().into(Tables.RepoGroup).values([row])
	          .exec().then(function (res) {
	            win.trigger('DB:Table.RepoGroup.onchange', {type: DBEventType.C});
	          });
	      });
	    }

	    this.addRopoId = function (id, repoId) {
	      DB.select().from(Tables.RepoGroup).where(Tables.RepoGroup.id.eq(id))
	        .exec().then(function (rows) {
	        if (rows && rows[0]) {
	          var ids = /string/i.test(typeof rows[0].repoIds)?
	            (rows[0].repoIds.length ? rows[0].repoIds.split(',') : []):
	            rows[0].repoIds;
	          if (ids.indexOf(repoId) == -1) {
	            ids.push(repoId);
	          }
	          DB.update(Tables.RepoGroup).set(Tables.RepoGroup.repoIds, ids).where(Tables.RepoGroup.id.eq(id))
	            .exec();
	        }
	      });
	    }

	    this.removeRopoId = function (id, repoId) {
	      DB.select().from(Tables.RepoGroup).where(Tables.RepoGroup.id.eq(id))
	        .exec().then(function (rows) {
	        if (rows && rows[0]) {
	          var ids = /string/i.test(typeof rows[0].repoIds)?
	                      (rows[0].repoIds.length ? rows[0].repoIds.split(',') : []):
	                      rows[0].repoIds,
	            idx = ids.indexOf(repoId);

	          if (idx != -1) {
	            ids.splice(idx, 1);
	          }
	          DB.update(Tables.RepoGroup).set(Tables.RepoGroup.repoIds, ids).where(Tables.RepoGroup.id.eq(id))
	            .exec();
	        }
	      });
	    }
	    this.updateName = function (id, name) {
	      DB.update(Tables.RepoGroup).set(Tables.RepoGroup.name, name).where(Tables.RepoGroup.id.eq(id))
	        .exec().then(function () {
	        win.trigger('DB:Table.RepoGroup.onchange', {type: DBEventType.U, fields: 'name'});
	      });
	    }

	    this.delete = function (id, callback) {
	      DB.delete()
	        .from(Tables.RepoGroup)
	        .where(Tables.RepoGroup.id.eq(id))
	        .exec().then(function (res) {
	        callback && callback(res);
	        win.trigger('DB:Table.RepoGroup.onchange', {type: DBEventType.D});
	      });
	    }

	    this.getAll = function (callback) {
	      DB.select()
	        .from(Tables.RepoGroup)
	        .orderBy(Tables.RepoGroup.create, lf.Order.DESC)
	        .exec().then(function (rows) {
	        callback && callback(rows);
	      });
	    }
	  };

	  this.RepoTagTable = new function () {
	    this.addDefaultTags = function(callback){
	      var tags = [
	        {
	          name: 'Red',
	          color: '#ff5f5f'
	        },
	        {
	          name: 'Orange',
	          color: '#fba45b'
	        },
	        {
	          name: 'Yellow',
	          color: '#f6cc67'
	        },
	        {
	          name: 'Green',
	          color: '#60cb68'
	        },
	        {
	          name: 'Blue',
	          color: '#33baef'
	        },
	        {
	          name: 'Purple',
	          color: '#d38adb'
	        },
	        {
	          name: 'Gray',
	          color: '#a4a4a7'
	        }
	      ];
	      DB.select().from(Tables.RepoTag)
	        .exec().then(function (rows) {
	        if(!rows.length){
	          var trows = [];
	          tags.forEach(function(key){
	            trows.push(Tables.RepoTag.createRow({
	              'name': key.name,
	              'color': key.color,
	              'repoIds': [],
	              'create': new Date()
	            }));
	          });
	          DB.insertOrReplace().into(Tables.RepoTag).values(trows)
	            .exec().then(function () {
	            callback && callback();
	          });
	        }else{
	          callback && callback();
	        }
	      });
	    }

	    this.add = function (name,color) {
	      if (!name || !color) {
	        return;
	      }
	      var row = Tables.RepoTag.createRow({
	        'name': name,
	        'color': color,
	        'repoIds': [],
	        'create': new Date()
	      });
	      DB.select().from(Tables.RepoTag).where(Tables.RepoTag.name.eq(name))
	        .exec().then(function (rows) {
	        !rows.length && DB.insertOrReplace().into(Tables.RepoTag).values([row])
	          .exec().then(function () {
	            win.trigger('DB:Table.RepoTag.onchange', {type: DBEventType.C});
	          });
	      });
	    }

	    this.addRopoId = function (id, repoId,callback) {
	      DB.select().from(Tables.RepoTag).where(Tables.RepoTag.id.eq(id))
	        .exec().then(function (rows) {
	        if (rows && rows[0]) {
	          var ids = rows[0].repoIds;
	          if (ids.indexOf(repoId) == -1) {
	            ids.push(repoId);
	          }
	          DB.update(Tables.RepoTag).set(Tables.RepoTag.repoIds, ids).where(Tables.RepoTag.id.eq(id))
	            .exec().then(function(){
	              callback && callback();
	              win.trigger('DB:Table.RepoTag.onchange', {type: DBEventType.U, fileds: ['repoIds']});
	            });
	        }
	      });
	    }

	    this.removeRopoId = function (id, repoId,callback) {
	      DB.select().from(Tables.RepoTag).where(Tables.RepoTag.id.eq(id))
	        .exec().then(function (rows) {
	        if (rows && rows[0]) {
	          var ids = rows[0].repoIds,
	            idx = ids.indexOf(repoId);

	          if (idx != -1) {
	            ids.splice(idx, 1);
	          }
	          DB.update(Tables.RepoTag).set(Tables.RepoTag.repoIds, ids).where(Tables.RepoTag.id.eq(id))
	            .exec().then(function(){
	              callback && callback();
	              win.trigger('DB:Table.RepoTag.onchange', {type: DBEventType.U, fileds: ['repoIds']});
	            });
	        }
	      });
	    }

	    this.updateName = function (id, name) {
	      DB.update(Tables.RepoTag).set(Tables.RepoTag.name, name).where(Tables.RepoTag.id.eq(id))
	        .exec().then(function () {
	        win.trigger('DB:Table.RepoTag.onchange', {type: DBEventType.U, fields: 'name'});
	      });
	    }

	    this.delete = function (id, callback) {
	      DB.delete()
	        .from(Tables.RepoTag)
	        .where(Tables.RepoTag.id.eq(id))
	        .exec().then(function (res) {
	        callback && callback(res);
	        win.trigger('DB:Table.RepoTag.onchange', {type: DBEventType.D});
	      });
	    }

	    this.getAll = function (callback) {
	      DB.select()
	        .from(Tables.RepoTag)
	        .orderBy(Tables.RepoTag.create, lf.Order.DESC)
	        .exec().then(function (rows) {
	        callback && callback(rows);
	      });
	    }
	  };

	  this.RepoTable = new function () {
	    var _Table = this;
	    this.addListByCurUser = function (repos, callback) {
	      function fn() {
	        _Table.deleteAllByUserId(curUser.id, function () {
	          var rows = [];
	          repos.forEach(function (key) {
	            rows.push(
	              Tables.Repo.createRow({
	                'userId': curUser.id,
	                'originRepoId': key.id,
	                'data': key,
	                'create': new Date()
	              })
	            );
	          });
	          DB.insertOrReplace().into(Tables.Repo).values(rows)
	            .exec().then(function () {
	            callback && callback();
	            win.trigger('DB:Table.Repo.onchange', {type: DBEventType.C});
	          });
	        });
	      }

	      if (curUser && curUser.name == curUserName) {
	        fn();
	      } else {
	        DB.select().from(Tables.User).where(Tables.User.name.eq(curUserName))
	          .exec().then(function (rows) {
	          curUser = rows[0];
	          fn.call(this);
	        });
	      }
	    }

	    this.delete = function (id, callback) {
	      DB.delete()
	        .from(Tables.Repo)
	        .where(Tables.Repo.id.eq(id))
	        .exec().then(function (res) {
	        callback && callback(res);
	        win.trigger('DB:Table.Repo.onchange', {type: DBEventType.D});
	      });
	    }

	    this.deleteAllByUserId = function (id, callback) {
	      DB.delete()
	        .from(Tables.Repo)
	        .where(Tables.Repo.userId.eq(id))
	        .exec().then(function (res) {
	        callback && callback(res);
	        win.trigger('DB:Table.Repo.onchange', {type: DBEventType.D});
	      });
	    }

	    this.getAll = function (callback) {
	      DB.select()
	        .from(Tables.Repo)
	        .exec().then(function (rows) {
	        callback && callback(rows);
	      });
	    }
	  };

	  this.setCurUserName = function (name) {
	    curUserName = name;
	  };
	  this.getCurUserName = function () {
	    return curUserName;
	  };
	  var githubRepos = new function () {
	    var _this = this;
	    var page = 1;
	    var mainData = [];

	    function concat(data) {
	      if (toString.call(data) == '[object Array]') {
	        mainData = mainData.concat(data);
	      }
	    }
	    this.resetPage = function(){
	      page = 1;
	      mainData = [];
	    }
	    this.request = function (callback) {
	      $.ajax({
	        type: 'GET',
	        dataType: 'json',
	        url: 'https://api.github.com/users/' + curUserName + '/repos?sort=updated&per_page=100&page=' + page,
	        success: function (data) {
	          if (data && data.length) {
	            concat(data);
	            page++;
	            _this.request(callback);
	          } else {
	            callback && callback(mainData);
	          }
	        }
	      });
	    }
	  };

	  var githubStars = new function () {
	    var _this = this;
	    var page = 1;
	    var mainData = [];

	    function concat(data) {
	      if (toString.call(data) == '[object Array]') {
	        mainData = mainData.concat(data);
	      }
	    }
	    this.resetPage = function(){
	      page = 1;
	      mainData = [];
	    }
	    this.request = function (callback) {
	      $.ajax({
	        type: 'GET',
	        dataType: 'json',
	        url: 'https://api.github.com/users/' + curUserName + '/starred?sort=updated&per_page=100&page=' + page,
	        success: function (data) {
	          if (data && data.length) {
	            concat(data);
	            page++;
	            _this.request(callback);
	          } else {
	            callback && callback(mainData);
	          }
	        }
	      });
	    }
	  };

	  this.getAll = function (callback) {
	    //select user
	    BM.UserTable.getAll(function (users) {
	      //select groups
	      BM.RepoGroupTable.getAll(function (groups) {
	        //select repos
	        BM.RepoTable.getAll(function (repos) {
	          //select tags
	          BM.RepoTagTable.getAll(function (tags) {
	            callback && callback.call(this, {
	              users: users || [],
	              repos: repos || [],
	              groups: groups || [],
	              tags: tags || []
	            });
	          });
	        });
	      });
	    });
	  }
	  this.syncGithub = function (callback) {
	    var data = [];
	    //reauest repos
	    githubRepos.resetPage();
	    githubRepos.request(function (res) {
	      data = data.concat(res);
	      //request star repos
	      githubRepos.resetPage();
	      githubStars.request(function (res) {
	        //add repos to DB
	        BM.RepoTable.addListByCurUser(data.concat(res), function () {
	          callback && callback();
	        });
	      });
	    });

	    this.UserTable.updateSync(curUserName);
	  }

	  this.arrayToObj = function (data,idName) {
	    var d = {};
	    idName = idName || 'id';
	    data.forEach(function (key) {
	      d[key[idName]] = key;
	    });
	    return d;
	  }

	};
	exports.bookmarkModel = bookmarkModel;

	var beanHelpersModel = new function () {
	  this.getRandomLabelType = function () {
	    var types = ['default', 'primary', 'success', 'info', 'warning', 'warning', 'danger'];
	    return Util.randomList(types, 1)[0];
	  }

	  this.getKeyWordReg = function (key) {
	    return new RegExp('([\\-_\\w\\d\\/\\$]{0,}){0,1}' + key + '([\\-_\\w\\d\\$]{0,}){0,1}', 'gi');
	  }
	};
	exports.beanHelpersModel = beanHelpersModel;
	//end model


/***/ }
/******/ ]);