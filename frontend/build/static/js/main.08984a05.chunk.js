(this["webpackJsonpftm-react"]=this["webpackJsonpftm-react"]||[]).push([[0],{38:function(e,t,a){},68:function(e,t,a){},70:function(e,t,a){},73:function(e,t,a){"use strict";a.r(t);var n=a(2),i=a.n(n),c=a(28),l=a.n(c),s=(a(38),a(32)),d=a(14),r=a(15),o=a(10),h=a(17),u=a(16),b=a(29),j=a.n(b),m=a(30),p=a.n(m),f=a(77),g=a(78),O=a(13),S=a(74),x=a(75),y=a(76),C=(a(68),a(1)),v=function(e){Object(h.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(d.a)(this,a),(n=t.call(this,e)).handleSubmit=function(e){return n.props.formSubmit(e)},n.handleChange=function(e){return n.props.inputChange(e)},n.handleSubmit=n.handleSubmit.bind(Object(o.a)(n)),n.handleChange=n.handleChange.bind(Object(o.a)(n)),n}return Object(r.a)(a,[{key:"render",value:function(){return Object(C.jsxs)(S.a,{onSubmit:this.handleSubmit,children:[Object(C.jsx)(x.a,{children:Object(C.jsx)(y.a,{onChange:this.handleChange,type:"file",id:"image",accept:"image/png, image/jpeg"})}),Object(C.jsx)(f.a,{children:"Submit"})]})}}]),a}(i.a.Component);var k=function(e){return Object(C.jsx)("iframe",{src:e.embedded,allow:"encrypted-media",title:"Spotify-Embedded-Player",width:"300",height:"380"})},I=a.p+"static/media/Sound-Wave.9601d5f1.png",w=(a(70),function(e){Object(h.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(d.a)(this,a),(n=t.call(this,e)).handleImageChange=function(e){n.setState({userImage:e.target.files[0]})},n.handleSubmit=function(e){e.preventDefault(),n.handleScanButtonClick(),console.log(n.state);var t=new p.a;t.append("userImage",n.state.userImage,n.state.userImage.name);var a,i=Object(s.a)(t);try{for(i.s();!(a=i.n()).done;){var c=a.value;console.log(c)}}catch(l){i.e(l)}finally{i.f()}j.a.post("/api/upload",t,{headers:{"Content-type":"multipart/form-data"}}).then((function(e){n.setState({uri:e.data.uri,embedded:e.data.embedded})})).catch((function(e){return console.log(e)}))},n.handleScanButtonClick=function(e){n.setState({isUploadState:!n.state.isUploadState,isPlayState:!n.state.isPlayState})},n.state={token:null,user:"",uri:null,embedded:null,userImage:null,title:"",newSelfie:!0,isUploadState:!1},n.handleSubmit=n.handleSubmit.bind(Object(o.a)(n)),n.handleImageChange=n.handleImageChange.bind(Object(o.a)(n)),n}return Object(r.a)(a,[{key:"render",value:function(){var e=this.state.uri,t=this.state.embedded,a=this.state.isUploadState;return Object(C.jsx)("div",{className:"App",children:Object(C.jsxs)("header",{className:"App-header",children:[Object(C.jsx)(O.Bounce,{top:!0,children:Object(C.jsx)("img",{src:I,className:"App-logo",alt:"logo"})}),Object(C.jsx)("h1",{children:"Welcome to Face the Music."}),Object(C.jsx)(O.Fade,{right:!0,children:Object(C.jsx)("p",{children:"What are you in the mood for?"})}),Object(C.jsx)(O.Fade,{left:!0,children:Object(C.jsx)("p",{className:"intro",children:"Face the Music takes a selfie, scans your emotions, and finds you a playlist suitable for that mood."})}),Object(C.jsx)(f.a,{color:"primary",onClick:this.handleScanButtonClick,children:"Start a scan!"}),Object(C.jsx)(O.Roll,{right:!0,when:a,children:Object(C.jsxs)("div",{id:"upload",style:{display:a?"block":"none"},children:[Object(C.jsx)("p",{id:"next-selfie",children:"Upload a selfie below to find a playlist:"}),Object(C.jsx)(v,{formSubmit:this.handleSubmit,inputChange:this.handleImageChange})]})}),Object(C.jsxs)(O.Slide,{bottom:!0,children:[Object(C.jsx)("div",{children:e&&Object(C.jsx)(g.a,{href:e,color:"success",children:"Play music on the app/web player."})}),Object(C.jsx)("div",{id:"Player",children:t&&Object(C.jsx)(k,{embedded:t})})]})]})})}}]),a}(i.a.Component)),F=(a(71),a(72),function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,79)).then((function(t){var a=t.getCLS,n=t.getFID,i=t.getFCP,c=t.getLCP,l=t.getTTFB;a(e),n(e),i(e),c(e),l(e)}))});l.a.render(Object(C.jsx)(i.a.StrictMode,{children:Object(C.jsx)(w,{})}),document.getElementById("root")),F()}},[[73,1,2]]]);
//# sourceMappingURL=main.08984a05.chunk.js.map