var app = app || {} ;
app.vue = app.vue || {} ;

console.log('im user js');

// (function(){
// 'use strict';
app.collections.modules.fetch({
	success(modules, response, opt){

		app.collections.materies.fetch({
			success(materies, response, opt){

				app.collections.comments.fetch({
					success(comments, response, opt){


						Vue.use(VueQuillEditor);

						//user-module-item
						Vue.component('user-module-item',{
							template: '#user-module-item-template',
							// props: ['id', 'name', 'module', 'modules' ],
							props:{
								modules:{
									default: function(){
										return modules.toJSON()
									} 
								}
							},
							methods: {
								cardOnClick(module){
									window.location = "#/module/"+module.id;
								}
							},
						});

						/*Vue.component('app-materies',{
							template: '#materies-template',
							props: ['id','materies'],
							data(){
								return {
									materies: materies.toJSON()
								}
							},
							watch:{
								"$route.params"(to, from){
									console.log({to,from})
								}
							}
						});*/

						//app-materies template
						var app_materies = {
							template: '#materies-template',
							props: {
								id: '',
								materies:{
									default:function(){
										return materies.toJSON()
									}
								}
							},
							methods:{
								cardOnClick(matery){
									// console.log(matery)
									app.vue.router.push("/matery/"+matery.id)
								}
							}
						};

						var app_matery = {
							template: '#matery-template',
							props: {
								id: '',
								matery: {
									default:function(){
										return materies.get({id: this.id }).toJSON()
									}
								},
							},
							data(){
								return {
									show_comments:false,
									comments: comments.toJSON(),
								}
							},
							methods:{
								cardOnClick(matery){
									console.log(matery, this.id )

								},
								commentOnClick(){
									this.show_comments = !this.show_comments;
									console.log(this.comments)
								},
								nextOnClick(){
									console.log('nextOnClick')
								}
							}
						};

						var app_comments = {
							template: "#comments-template",
							props: ['id','comments'], /*{
								id: '',
								comments: { //sama aja kaya [] array
									default(){
										return comments.toJSON();
									}
								}
								comments:''
							}*/
							
						};

						var app_comment = {
							template: "#comment-template",
							props: {
								id: '',
								user_id:'',
								username:'', //ini akan bermasalah, karena dapat dari Auth bkn ambil dari API users

							},
							data(){
								return {
									editorOption:{
										theme: "snow",
										modules: {
								            toolbar: [
								              [{ 'size': ['small', false, 'large'] }],
								              ['bold', 'italic'],
								              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
								              ['link', 'image']
								            ]
								        }
									},
									comments: comments.toJSON(),
									newComment: {
										user_id:'',
										matery_id: "",
										comment:'',
									}
								}
							},
							methods:{
								getAll(params){
									_this = this;
									//kalau params diset, langsung saja refer ke paramas, kalau tidak, fetch ulang
									/*if( typeof(params) !== "undefined"){
										_this.comments = params.toJSON(); //bukan this tp harus ganti dari parentnya.
										app_matery.comments = params.toJSON();
										console.log( "success getAll" , app_matery.comments );
									}else{*/
										
										comments.fetch({
											success(col, response, opt){
												_this = col.toJSON();
												app_matery.comments = col.toJSON();
												console.log( "success getAll", app_matery.comments );
											},
											error(err){
												console.log(err);
												alert(err)
											}
										})
									/*}*/
								},
								sendComment(matery_id){
									if(this.newComment.comment == ""){
										alert('you need to add comment')
										return false;
									}

									//this.id & this.user_id sudah diisi di template, jd ketika fungsi ini dipanggil
									// value nya sudah ada. 
									this.newComment.matery_id = this.id;
									this.newComment.user_id = this.user_id;

									console.log("sendComment", this.newComment );
									var _this = this;

									comments.create(this.newComment,{
										success(col, response, opt){
											console.log("berhasil menyimpan")
											_this.getAll(col)
											_this.newComment = {
												user_id:'',
												matery_id: "",
												comment:'',
											}
										},
										error(err){
											console.log(err)
											alert(err)
										}
									});

								},
								
							},
						}
						
						Vue.component('app-comment', app_comment )
						Vue.component('app-comments', app_comments )

						app.vue.router = new VueRouter({
							routes: [
								{
									path: "/", 
									component: Vue.component("user-module-item")
								 },
								{
									path: "/module/:id",
									component: app_materies,//Vue.component("app-materies"),
									props:true
								},

								{
									path: "/matery/:id",
									component: app_matery,//Vue.component("app-materies"),
									props:true
								},

							]
						});

						app.vue.user = new Vue({
							el: "#play",
							router: app.vue.router,
							data(){ 
								return {
									modules: modules.toJSON(),
									materies: materies.toJSON(),
									comments: comments.toJSON(),
									editorOption:{

									}
								}
							},/*
							components: {
								"app-materies": app_materies,
								"app-matery": app_matery,
								"app-comments": app_comments,
							},*/

						})


					},
					error(err){
						console.log(err)
						alert(err)
					}
				});


				// console.log(app_comments)

			},
			error(err){
				console.log(err)
			}
		})


	},
	error(err){
		console.log(err);
		alert(err);
	}
})


// });