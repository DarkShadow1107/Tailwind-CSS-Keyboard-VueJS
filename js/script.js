var script = {
	data() {
		return {
			keys: [
				{ label: "`", width: "12", row: "1" },
				{ label: "1", width: "10", row: "1" },
				{ label: "2", width: "10", row: "1" },
				{ label: "3", width: "10", row: "1" },
				{ label: "4", width: "10", row: "1" },
				{ label: "5", width: "10", row: "1" },
				{ label: "6", width: "10", row: "1" },
				{ label: "7", width: "10", row: "1" },
				{ label: "8", width: "10", row: "1" },
				{ label: "9", width: "10", row: "1" },
				{ label: "0", width: "10", row: "1" },
				{ label: "-", width: "10", row: "1" },
				{ label: "=", width: "full", row: "1", flexGrow: true },
				{ label: "delete", width: "full", row: "1", flexGrow: true },
				{ label: "tab", width: "14", row: "2" },
				{ label: "Q", width: "10", row: "2" },
				{ label: "W", width: "10", row: "2" },
				{ label: "E", width: "10", row: "2" },
				{ label: "R", width: "10", row: "2" },
				{ label: "T", width: "10", row: "2" },
				{ label: "Y", width: "10", row: "2" },
				{ label: "U", width: "10", row: "2" },
				{ label: "I", width: "10", row: "2" },
				{ label: "O", width: "10", row: "2" },
				{ label: "P", width: "10", row: "2" },
				{ label: "[", width: "12", row: "2" },
				{ label: "]", width: "12", row: "2" },
				{ label: "|", width: "full", row: "2", flexGrow: true },
				{ label: "caps", width: "16", row: "3" },
				{ label: "A", width: "10", row: "3" },
				{ label: "S", width: "10", row: "3" },
				{ label: "D", width: "10", row: "3" },
				{ label: "F", width: "10", row: "3" },
				{ label: "G", width: "10", row: "3" },
				{ label: "H", width: "10", row: "3" },
				{ label: "J", width: "10", row: "3" },
				{ label: "K", width: "10", row: "3" },
				{ label: "L", width: "10", row: "3" },
				{ label: ";", width: "10", row: "3" },
				{ label: "'", width: "10", row: "3" },
				{ label: "return", width: "full", row: "3", flexGrow: true },
				{ label: "shift", width: "20", row: "4" },
				{ label: "Z", width: "10", row: "4" },
				{ label: "X", width: "10", row: "4" },
				{ label: "C", width: "10", row: "4" },
				{ label: "V", width: "10", row: "4" },
				{ label: "B", width: "10", row: "4" },
				{ label: "n", width: "10", row: "4" },
				{ label: "M", width: "10", row: "4" },
				{ label: ",", width: "10", row: "4" },
				{ label: ".", width: "10", row: "4" },
				{ label: "/", width: "10", row: "4" },
				{ label: "shift", width: "16", row: "4", flexGrow: true },
				{ label: "▲", width: "10", row: "4" },
				{ label: "", width: "10", row: "4" },
				{ label: "fn", width: "10", row: "5" },
				{ label: "ctrl", width: "10", row: "5" },
				{ label: "opt", width: "10", row: "5" },
				{ label: "cmd", width: "10", row: "5" },
				{ label: "", width: "full", row: "5", flexGrow: true },
				{ label: "cmd", width: "10", row: "5" },
				{ label: "opt", width: "10", row: "5" },
				{ label: "◄", width: "10", row: "5" },
				{ label: "▼", width: "10", row: "5" },
				{ label: "►", width: "10", row: "5" },
			],
		};
	},
	methods: {
		doSomething() {
			alert("Hello!");
		},
	},
};

function normalizeComponent(
	template,
	style,
	script,
	scopeId,
	isFunctionalTemplate,
	moduleIdentifier /* server only */,
	shadowMode,
	createInjector,
	createInjectorSSR,
	createInjectorShadow
) {
	if (typeof shadowMode !== "boolean") {
		createInjectorSSR = createInjector;
		createInjector = shadowMode;
		shadowMode = false;
	}
	// Vue.extend constructor export interop.
	const options = typeof script === "function" ? script.options : script;
	// render functions
	if (template && template.render) {
		options.render = template.render;
		options.staticRenderFns = template.staticRenderFns;
		options._compiled = true;
		// functional template
		if (isFunctionalTemplate) {
			options.functional = true;
		}
	}
	// scopedId
	if (scopeId) {
		options._scopeId = scopeId;
	}
	let hook;
	if (moduleIdentifier) {
		// server build
		hook = function (context) {
			// 2.3 injection
			context =
				context || // cached call
				(this.$vnode && this.$vnode.ssrContext) || // stateful
				(this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
			// 2.2 with runInNewContext: true
			if (!context && typeof __VUE_SSR_CONTEXT__ !== "undefined") {
				context = __VUE_SSR_CONTEXT__;
			}
			// inject component styles
			if (style) {
				style.call(this, createInjectorSSR(context));
			}
			// register component module identifier for async chunk inference
			if (context && context._registeredComponents) {
				context._registeredComponents.add(moduleIdentifier);
			}
		};
		// used by ssr in case component is cached and beforeCreate
		// never gets called
		options._ssrRegister = hook;
	} else if (style) {
		hook = shadowMode
			? function (context) {
				tyle.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
			}
			: function (context) {
				style.call(this, createInjector(context));
			};
	}
	if (hook) {
		if (options.functional) {
			// register for functional component in vue file
			const originalRender = options.render;
			options.render = function renderWithStyleInjection(h, context) {
				hook.call(context);
				return originalRender(h, context);
			};
		} else {
			// inject component registration as beforeCreate hook
			const existing = options.beforeCreate;
			options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
		}
	}
	return script;
}

const isOldIE = typeof navigator !== "undefined" && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
	return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
	const group = isOldIE ? css.media || "default" : id;
	const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
	if (!style.ids.has(id)) {
		style.ids.add(id);
		let code = css.source;
		if (css.map) {
			// https://developer.chrome.com/devtools/docs/javascript-debugging
			// this makes source maps inside style tags work properly in Chrome
			code += "\n/*# sourceURL=" + css.map.sources[0] + " */";
			// http://stackoverflow.com/a/26603875
			code +=
				"\n/*# sourceMappingURL=data:application/json;base64," +
				btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
				" */";
		}
		if (!style.element) {
			style.element = document.createElement("style");
			style.element.type = "text/css";
			if (css.media) style.element.setAttribute("media", css.media);
			if (HEAD === undefined) {
				HEAD = document.head || document.getElementsByTagName("head")[0];
			}
			HEAD.appendChild(style.element);
		}
		if ("styleSheet" in style.element) {
			style.styles.push(code);
			style.element.styleSheet.cssText = style.styles.filter(Boolean).join("\n");
		} else {
			const index = style.ids.size - 1;
			const textNode = document.createTextNode(code);
			const nodes = style.element.childNodes;
			if (nodes[index]) style.element.removeChild(nodes[index]);
			if (nodes.length) style.element.insertBefore(textNode, nodes[index]);
			else style.element.appendChild(textNode);
		}
	}
}

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {
	var _vm = this;
	var _h = _vm.$createElement;
	var _c = _vm._self._c || _h;
	return _c(
		"main",
		{
			staticClass: "min-w-screen bg-purple-500 text-purple-700 text-xs min-h-screen flex items-center justify-center",
		},
		[
			_c(
				"div",
				{
					staticClass:
						"bg-purple-700 p-3 rounded-lg border-2 border-t-purple-600 border-x-purple-800 border-b-purple-900 shadow-lg",
				},
				[
					_c("div", { staticClass: "p-1 bg-purple-900 rounded overflow-hidden" }, [
						_c(
							"div",
							{ staticClass: "flex space-x-[2px]" },
							_vm._l(_vm.keys, function (key) {
								return key.row === "1"
									? _c(
											"div",
											{
												key: key.label,
												staticClass: "h-10 min-w-10",
												class: [key.flexGrow ? "flex-grow" : "", ""],
											},
											[
												_c(
													"button",
													{
														staticClass:
															"overflow-hidden relative h-10 px-1 rounded flex justify-center shadow align-center bg-gradient-to-b from-purple-50 to-purple-400 pt-[2px] transition-all duration-75 top-0 active:top-1",
														class: "w-" + [key.width],
													},
													[
														_vm._m(0, true),
														_vm._v(" "),
														_c(
															"div",
															{
																staticClass:
																	"relative h-7 border border-purple-100 flex-grow bg-gradient-to-b from-purple-200 to-purple-50 flex pt-1 pl-1 rounded",
															},
															[
																_c("span", { staticClass: "leading-none" }, [
																	_vm._v(_vm._s(key.label)),
																]),
															]
														),
													]
												),
											]
									)
									: _vm._e();
							}),
							0
						),
						_vm._v(" "),
						_c(
							"div",
							{ staticClass: "flex space-x-[2px] mt-[2px]" },
							_vm._l(_vm.keys, function (key) {
								return key.row === "2"
									? _c(
											"div",
											{
												key: key.label,
												staticClass: "h-10 min-w-10",
												class: [key.flexGrow ? "flex-grow" : "", ""],
											},
											[
												_c(
													"button",
													{
														staticClass:
															"overflow-hidden relative h-10 px-1 rounded flex justify-center shadow align-center bg-gradient-to-b from-purple-50 to-purple-400 pt-[2px] transition-all duration-75 top-0 active:top-1",
														class: "w-" + [key.width],
													},
													[
														_vm._m(1, true),
														_vm._v(" "),
														_c(
															"div",
															{
																staticClass:
																	"relative h-7 border border-purple-100 flex-grow bg-gradient-to-b from-purple-200 to-purple-50 flex pt-1 pl-1 rounded",
															},
															[
																_c("span", { staticClass: "leading-none" }, [
																	_vm._v(_vm._s(key.label)),
																]),
															]
														),
													]
												),
											]
									)
									: _vm._e();
							}),
							0
						),
						_vm._v(" "),
						_c(
							"div",
							{ staticClass: "flex space-x-[2px] mt-[2px]" },
							_vm._l(_vm.keys, function (key) {
								return key.row === "3"
									? _c(
											"div",
											{
												key: key.label,
												staticClass: "h-10 min-w-10",
												class: [key.flexGrow ? "flex-grow" : "", ""],
											},
											[
												_c(
													"button",
													{
														staticClass:
															"overflow-hidden relative h-10 px-1 rounded flex justify-center shadow align-center bg-gradient-to-b from-purple-50 to-purple-400 pt-[2px] transition-all duration-75 top-0 active:top-1",
														class: "w-" + [key.width],
													},
													[
														_vm._m(2, true),
														_vm._v(" "),
														_c(
															"div",
															{
																staticClass:
																	"relative h-7 border border-purple-100 flex-grow bg-gradient-to-b from-purple-200 to-purple-50 flex pt-1 pl-1 rounded",
															},
															[
																_c("span", { staticClass: "leading-none" }, [
																	_vm._v(_vm._s(key.label)),
																]),
															]
														),
													]
												),
											]
									)
									: _vm._e();
							}),
							0
						),
						_vm._v(" "),
						_c(
							"div",
							{ staticClass: "flex space-x-[2px] mt-[2px]" },
							_vm._l(_vm.keys, function (key) {
								return key.row === "4"
									? _c(
											"div",
											{
												key: key.label,
												staticClass: "h-10 min-w-10",
												class: [key.flexGrow ? "flex-grow" : "", ""],
											},
											[
												_c(
													"button",
													{
														staticClass:
															"overflow-hidden relative h-10 px-1 rounded flex justify-center shadow align-center bg-gradient-to-b from-purple-50 to-purple-400 pt-[2px] transition-all duration-75 top-0 active:top-1",
														class: "w-" + [key.width],
													},
													[
														_vm._m(3, true),
														_vm._v(" "),
														_c(
															"div",
															{
																staticClass:
																	"relative h-7 border border-purple-100 flex-grow bg-gradient-to-b from-purple-200 to-purple-50 flex pt-1 pl-1 rounded",
															},
															[
																_c("span", { staticClass: "leading-none" }, [
																	_vm._v(_vm._s(key.label)),
																]),
															]
														),
													]
												),
											]
									)
									: _vm._e();
							}),
							0
						),
						_vm._v(" "),
						_c(
							"div",
							{ staticClass: "flex space-x-[2px] mt-[2px]" },
							_vm._l(_vm.keys, function (key) {
								return key.row === "5"
									? _c(
											"div",
											{
												key: key.label,
												staticClass: "h-10 min-w-10",
												class: [key.flexGrow ? "flex-grow" : "", ""],
											},
											[
												_c(
													"button",
													{
														staticClass:
															"overflow-hidden relative h-10 px-1 rounded flex justify-center shadow align-center bg-gradient-to-b from-purple-50 to-purple-400 pt-[2px] transition-all duration-75 top-0 active:top-1",
														class: "w-" + [key.width],
													},
													[
														_vm._m(4, true),
														_vm._v(" "),
														_c(
															"div",
															{
																staticClass:
																	"relative h-7 border border-purple-100 flex-grow bg-gradient-to-b from-purple-200 to-purple-50 flex pt-1 pl-1 rounded",
															},
															[
																_c("span", { staticClass: "leading-none" }, [
																	_vm._v(_vm._s(key.label)),
																]),
															]
														),
													]
												),
											]
									)
									: _vm._e();
							}),
							0
						),
					]),
				]
			),
		]
	);
};
var __vue_staticRenderFns__ = [
	function () {
		var _vm = this;
		var _h = _vm.$createElement;
		var _c = _vm._self._c || _h;
		return _c(
			"div",
			{
				staticClass: "w-full h-10 absolute -top-[2px] left-0 flex items-center justify-between blur-sm",
			},
			[
				_c("div", {
					staticClass: "h-8 w-8 bg-purple-200 flex-shrink-0 rotate-45 -left-5 relative",
				}),
				_vm._v(" "),
				_c("div", {
					staticClass: "h-8 w-8 bg-purple-200 flex-shrink-0 rotate-45 -right-5 relative",
				}),
			]
		);
	},
	function () {
		var _vm = this;
		var _h = _vm.$createElement;
		var _c = _vm._self._c || _h;
		return _c(
			"div",
			{
				staticClass: "w-full h-10 absolute -top-[2px] left-0 flex items-center justify-between blur-sm",
			},
			[
				_c("div", {
					staticClass: "h-8 w-8 bg-purple-200 flex-shrink-0 rotate-45 -left-5 relative",
				}),
				_vm._v(" "),
				_c("div", {
					staticClass: "h-8 w-8 bg-purple-200 flex-shrink-0 rotate-45 -right-5 relative",
				}),
			]
		);
	},
	function () {
		var _vm = this;
		var _h = _vm.$createElement;
		var _c = _vm._self._c || _h;
		return _c(
			"div",
			{
				staticClass: "w-full h-10 absolute -top-[2px] left-0 flex items-center justify-between blur-sm",
			},
			[
				_c("div", {
					staticClass: "h-8 w-8 bg-purple-200 flex-shrink-0 rotate-45 -left-5 relative",
				}),
				_vm._v(" "),
				_c("div", {
					staticClass: "h-8 w-8 bg-purple-200 flex-shrink-0 rotate-45 -right-5 relative",
				}),
			]
		);
	},
	function () {
		var _vm = this;
		var _h = _vm.$createElement;
		var _c = _vm._self._c || _h;
		return _c(
			"div",
			{
				staticClass: "w-full h-10 absolute -top-[2px] left-0 flex items-center justify-between blur-sm",
			},
			[
				_c("div", {
					staticClass: "h-8 w-8 bg-purple-200 flex-shrink-0 rotate-45 -left-5 relative",
				}),
				_vm._v(" "),
				_c("div", {
					staticClass: "h-8 w-8 bg-purple-200 flex-shrink-0 rotate-45 -right-5 relative",
				}),
			]
		);
	},
	function () {
		var _vm = this;
		var _h = _vm.$createElement;
		var _c = _vm._self._c || _h;
		return _c(
			"div",
			{
				staticClass: "w-full h-10 absolute -top-[2px] left-0 flex items-center justify-between blur-sm",
			},
			[
				_c("div", {
					staticClass: "h-8 w-8 bg-purple-200 flex-shrink-0 rotate-45 -left-5 relative",
				}),
				_vm._v(" "),
				_c("div", {
					staticClass: "h-8 w-8 bg-purple-200 flex-shrink-0 rotate-45 -right-5 relative",
				}),
			]
		);
	},
];
__vue_render__._withStripped = true;

/* style */
const __vue_inject_styles__ = function (inject) {
	if (!inject) return;
	inject("data-v-ae77e3dc_0", {
		source: "\n\n",
		map: { version: 3, sources: [], names: [], mappings: "", file: "pen.vue" },
		media: undefined,
	});
};
/* scoped */
const __vue_scope_id__ = undefined;
/* module identifier */
const __vue_module_identifier__ = undefined;
/* functional template */
const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/ normalizeComponent(
	{ render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
	__vue_inject_styles__,
	__vue_script__,
	__vue_scope_id__,
	__vue_is_functional_template__,
	__vue_module_identifier__,
	false,
	createInjector,
	undefined,
	undefined
);

export default __vue_component__;
