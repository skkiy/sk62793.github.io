(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[193],{369:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/reports/[id]",function(){return n(4585)}])},6961:function(e,t,n){"use strict";n.d(t,{Gl:function(){return k},Ej:function(){return u},Ar:function(){return f},_2:function(){return l}});var r=n(5893),i=n(3236),s=n(8544),a=n.n(s),c=function(e){var t=e.text;return(0,r.jsx)(r.Fragment,{children:t.map((function(e,t){var n=e.annotations,i=n.bold,s=n.code,c=n.color,l=n.italic,o=n.strikethrough,d=n.underline,u=e.type;return(0,r.jsxs)("span",{className:[i?a().bold:"",s?a().code:"",l?a().italic:"",o?a().strikethrough:"",d?a().underline:""].join(" "),style:"default"!==c?{color:c}:{},children:["text"===u?e.text.link?(0,r.jsx)("a",{href:e.text.link.url,children:e.text.content}):(0,r.jsx)("p",{dangerouslySetInnerHTML:{__html:e.text.content.replace(/\r?\n/g,"<br>")}}):(0,r.jsx)(r.Fragment,{}),"mention"===u||"equation"===u&&(0,r.jsx)("p",{dangerouslySetInnerHTML:{__html:e.plain_text.replace(/\r?\n/g,"<br>")}})]},t)}))})},l=function(e){var t=e.type,n=e.id;switch(t){case"paragraph":return(0,r.jsx)(i.xu,{marginY:2,children:(0,r.jsx)(c,{text:e[t].text})});case"heading_1":return(0,r.jsx)(i.X6,{as:"h1",size:"xl",marginY:6,children:(0,r.jsx)(c,{text:e[t].text})});case"heading_2":return(0,r.jsx)(i.X6,{as:"h2",size:"lg",marginY:4,children:(0,r.jsx)(c,{text:e[t].text})});case"heading_3":return(0,r.jsx)(i.X6,{as:"h3",size:"md",marginY:3,children:(0,r.jsx)(c,{text:e[t].text})});case"bulleted_list_item":case"numbered_list_item":return(0,r.jsx)(i.QI,{children:(0,r.jsx)(i.HC,{children:(0,r.jsx)(c,{text:e[t].text})})});case"to_do":return(0,r.jsx)("div",{children:(0,r.jsxs)("label",{htmlFor:n,children:[(0,r.jsx)("input",{type:"checkbox",id:n,defaultChecked:e[t].checked})," ",(0,r.jsx)(c,{text:e[t].text})]})});case"toggle":var s=e[t];return(0,r.jsx)("details",{children:(0,r.jsx)("summary",{children:(0,r.jsx)(c,{text:s.text})})});case"child_page":return(0,r.jsx)("p",{children:e[t].title});case"image":var a=e[t],l="external"===a.type?a.external.url:a.file.url,o=a.caption?a.caption[0].plain_text:"";return(0,r.jsxs)("figure",{children:[(0,r.jsx)("img",{src:l,alt:o}),o&&(0,r.jsx)("figcaption",{children:o})]});case"divider":return(0,r.jsx)("hr",{},n);case"quote":return(0,r.jsx)("blockquote",{children:e[t].text[0].plain_text},n);default:return"\u274c Unsupported block (".concat("unsupported"===t?"unsupported by Notion API":t,")")}},o=n(3855),d=n(5313),u=function(e){var t=e.dateString,n=(0,o.Z)(t);return(0,r.jsx)("time",{dateTime:t,children:(0,d.Z)(n,"LLLL d, yyyy")})},h=n(9008),x=n(1664),_=n(1484),g=n.n(_),m=n(5353),j=n.n(m),p=n(2754),f=function(e){var t=e.children,n=e.home;return(0,r.jsxs)(i.xu,{className:g().container,minH:"100%",marginY:0,children:[(0,r.jsxs)(h.default,{children:[(0,r.jsx)("link",{rel:"icon",href:"/favicon.png"}),(0,r.jsx)("meta",{name:"description",content:"sasayu's portfolio"}),(0,r.jsx)("meta",{property:"og:image",content:"https://og-image.vercel.app/".concat(encodeURI(p.j),".png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg")}),(0,r.jsx)("meta",{name:"og:title",content:p.j}),(0,r.jsx)("meta",{name:"twitter:card",content:"summary_large_image"})]}),(0,r.jsx)("header",{className:g().header,children:n?(0,r.jsxs)(i.kC,{alignItems:"center",children:[(0,r.jsx)("img",{src:"/images/profile.png",className:j().borderCircle,height:144,width:144,alt:p.A}),(0,r.jsx)("h1",{className:j().heading2Xl,children:p.A})]}):(0,r.jsxs)(i.kC,{alignItems:"center",children:[(0,r.jsx)(x.default,{href:"/",children:(0,r.jsx)("a",{children:(0,r.jsx)("img",{src:"/images/profile.png",className:j().borderCircle,height:108,width:108,alt:p.A})})}),(0,r.jsx)("h2",{className:j().headingLg,children:(0,r.jsx)(x.default,{href:"/",children:(0,r.jsx)("a",{className:j().colorInherit,children:p.A})})})]})}),(0,r.jsx)("main",{children:t}),!n&&(0,r.jsx)("div",{className:g().backToHome,children:(0,r.jsx)(x.default,{href:"/",children:(0,r.jsx)("a",{children:"\u2190 Back to home"})})})]})},k=function(e){e.id;var t=e.name,n=e.color;return(0,r.jsx)(i.Ct,{colorScheme:n,variant:"subtle",children:t})}},2754:function(e,t,n){"use strict";n.d(t,{A:function(){return r},j:function(){return i}});var r="sasayu",i="\u3055\u3055\u3086"},4585:function(e,t,n){"use strict";n.r(t),n.d(t,{__N_SSG:function(){return o}});var r=n(5893),i=n(7294),s=n(9008),a=n(6961),c=n(5353),l=n.n(c),o=!0;t.default=function(e){var t,n=e.reportData;return(0,r.jsxs)(a.Ar,{children:[(0,r.jsx)(s.default,{children:(0,r.jsx)("title",{children:n.title})}),(0,r.jsxs)("article",{children:[(0,r.jsx)("h1",{className:l().headingXl,children:n.title}),(0,r.jsx)("div",{className:l().lightText,children:(0,r.jsx)(a.Ej,{dateString:n.date||""})}),null===(t=n.contents)||void 0===t?void 0:t.map((function(e,t){return(0,r.jsx)(i.Fragment,{children:(0,a._2)(e)},t)}))]})]})}},8544:function(e){e.exports={container:"content_container__LsbCP",name:"content_name__pm0u6",back:"content_back__RF_0D",bold:"content_bold__MtGQ3",code:"content_code__eKDO8",italic:"content_italic__0kLtA",strikethrough:"content_strikethrough___tziv",underline:"content_underline__2L1yQ"}},1484:function(e){e.exports={container:"layout_container__pZpZt",header:"layout_header__IkGGL",backToHome:"layout_backToHome__n4KwR"}},5353:function(e){e.exports={heading2Xl:"utils_heading2Xl__I4imu",headingXl:"utils_headingXl__Lj33n",headingLg:"utils_headingLg__kWQrI",headingMd:"utils_headingMd__XfiuC",borderCircle:"utils_borderCircle__Sg_L7",colorInherit:"utils_colorInherit__BYQ7W",padding1px:"utils_padding1px___ZgVg",list:"utils_list__GLciC",listItem:"utils_listItem__91Hos",lightText:"utils_lightText__Un0eT"}}},function(e){e.O(0,[14,774,888,179],(function(){return t=369,e(e.s=t);var t}));var t=e.O();_N_E=t}]);