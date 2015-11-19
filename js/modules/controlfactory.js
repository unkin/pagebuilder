﻿/** * control factory */ControlFactory = Backbone.Model.extend({}, {    _controlMap: {        page: PageControl,        heading: HeadingControl,        pageheader: PageHeaderControl,        pagecontent: PageContentControl,        navbar: NavBarControl,        pagefooter: PageFooterControl,        listview: ListViewControl,        collapsible: CollapsibleSetControl,        collapsiblecontent: CollapsibleContentControl,        grid: GridControl,		gridblock: GridBlockControl,		text: TextBlockControl,		link: LinkControl,		button: ButtonControl,		image: ImageControl,		form: FormControl,		submitbutton: SubmitButtonControl,		textinput: TextInputControl,		textarea: TextAreaControl,		radiobuttons: RadioButtonControl,		radio: RadioInputControl,		checkboxes: CheckboxControl,		checkbox: CheckboxInputControl,		selectmenu: SelectControl,		slider: SliderControl,		video: VideoControl,		audio: AudioControl,		googlemaps: GoogleMapsControl,        datatable: DataTableControl,        html: HtmlControl		/*		tabbar: TabBarControl,		searchinput: SearchInputControl,		toggleswitch: ToggleSwitchControl,		selectmenu: SelectControl,		youtube: YouTubeControl,		split: SplitContentControl,		splitsecondary: SplitSecondaryContentControl,		splitprimary: SplitPrimaryContentControl		*/    },    cloneControl: function (a) {        var b = this.newControl(a.controlType);        return b    },	 /**     * 通过类型获取(Control)控制器     * a, 是控件ID     */    getControlForType: function (a) {        var b = this._controlMap[a];        return b ? b : null    },	 /**     * 实例化控制器     * a, 控件ID	 * b, 额外的参数，用于传递到具体控件的初始化方法中     */    newControl: function (a, b) {        var c = this._controlMap[a];        return c ? new c(b) : (console.error("ControlFactory: unable to construct control of type: " + a), null)    },	 /**     * 深度克隆控制器     * a, 控件ID     */    deepCloneControl: function (a, b) {		if (b > 100) return console.error("Detected circular reference in deep clone control"),        null;        var c = a.children,            d = this.cloneControl(a);        for (var e = 0; e < c.length; e++) {            var f = c[e],                g = this.deepCloneControl(f, b + 1);            d.addChild(g)        }        return d    }}),ControlOutputVisitor = Backbone.Model.extend({    _i: function (a) {        return Array(a + 1).join("  ")    },	/**	 * a, 控件对象	 * b, title名称	 */    getAppHtml: function (a, b) {        var c = this.getOutputTree(a),            d = $(c).html();			e = "#template-html",			f = Handlebars.compile($(e).html().replace(/&lt;/g, "<").replace(/&gt;/g, ">")),			g = f({				title: b,				body: d			});        return g    },    getAppFragmentHtml: function (a) {        var b = (new Date).getTime(),            c = this.getOutputTree(a),            d = $(c).html(),            e = (new Date).getTime();        return console.log("Getting fragment HTML took", (e - b) / 1e3, "seconds"),        d    },    getAppDocument: function (a) {        return this.getOutputDict(a)    },    getOutputDict: function (a) {        var b = a.children,            c = [];        for (var d = 0; d < b.length; d++) {            var e = b[d],                f = this.getOutputDict(e);            c.push(f)        }        return {			type: a.getControlType(),            id: a.getId(),          			properties: a.getSerializedProperties(),            children: c                   }    },    getOutputTree: function (a) {        return this.quickGetOutputTree(a)    },    _getOutputTree: function (a, b) {        if (!a._supportsChildRendering) return;        var c = a.children;        for (var d = 0; d < c.length; d++) {            var e = c[d],                f = e.cloneControl(),                g = document.createElement("div");            f.renderTo(g);            var h = $(":first", g).clone();            $(b).append(h);            if (f.getOutputAppendSelector() == "") this._getOutputTree(f, h);            else {                var i = $(f.getOutputAppendSelector(), h);                this._getOutputTree(f, i)            }        }    },    quickGetOutputTree: function (a) {        var b = document.createElement("div");        return a.quickRenderTo(b),        $(b)    }});