!function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=13)}([function(e,t){e.exports=require("express")},function(e,t){e.exports=require("babel-runtime/helpers/asyncToGenerator")},function(e,t){e.exports=require("babel-runtime/helpers/slicedToArray")},function(e,t){e.exports=require("babel-runtime/regenerator")},function(e,t){e.exports=require("mysql2/promise")},function(e,t,n){"use strict";var r=u(n(3)),i=u(n(2)),a=u(n(1));function u(e){return e&&e.__esModule?e:{default:e}}var c=n(0).Router();c.get("/",function(){var e=(0,a.default)(r.default.mark(function e(t,n){var a,u,c,o;return r.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a="SELECT recipe_id, recipe_name, recipe_type_id, recipe_image\n                 FROM nobsc_recipes",e.next=4,pool.execute(a);case 4:u=e.sent,c=(0,i.default)(u,1),o=c[0],n.send(o),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(0),console.log(e.t0);case 13:case"end":return e.stop()}},e,void 0,[[0,10]])}));return function(t,n){return e.apply(this,arguments)}}()),c.get("/:id",function(){var e=(0,a.default)(r.default.mark(function e(t,n){var a,u,c,o,s;return r.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a=t.params.id,u="SELECT recipe_id, recipe_name, recipe_type_id, recipe_image\n                 FROM nobsc_recipes\n                 WHERE recipe_id = ?",e.next=5,pool.execute(u,[a]);case 5:c=e.sent,o=(0,i.default)(c,1),s=o[0],n.send(s),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0),console.log(e.t0);case 14:case"end":return e.stop()}},e,void 0,[[0,11]])}));return function(t,n){return e.apply(this,arguments)}}()),c.post("/",function(){var e=(0,a.default)(r.default.mark(function e(t,n){var i,a,u,c,o,s,p,d,f;return r.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,i=t.body,a=i.id,u=i.name,c=i.typeId,o=i.image,s=i.equipmentImage,p=i.ingredientsImage,d=i.cookingImage,f="INSERT INTO nobsc_recipes\n                 (recipe_id, recipe_name, recipe_type_id, recipe_image, equipment_image, ingredients_image, cooking_image)\n                 VALUES\n                 (?, ?, ?, ?)",e.next=5,pool.execute(f,[a,u,c,o,s,p,d]);case 5:n.status(201).json({message:"Recipe submitted",id:a,name:u,typeId:c,image:o,equipmentImage:s,ingredientsImage:p,cookingImage:d}),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),console.log(e.t0);case 11:case"end":return e.stop()}},e,void 0,[[0,8]])}));return function(t,n){return e.apply(this,arguments)}}()),c.get("/types",function(){var e=(0,a.default)(r.default.mark(function e(t,n){var a,u,c,o;return r.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a="SELECT recipe_type_id, recipe_type_name\n                 FROM nobsc_recipe_types",e.next=4,pool.execute(a);case 4:u=e.sent,c=(0,i.default)(u,1),o=c[0],n.send(o),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(0),console.log(e.t0);case 13:case"end":return e.stop()}},e,void 0,[[0,10]])}));return function(t,n){return e.apply(this,arguments)}}()),c.get("/types/:id",function(){var e=(0,a.default)(r.default.mark(function e(t,n){var a,u,c,o,s;return r.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a=t.params.id,u="SELECT recipe_type_id, recipe_type_name\n                 FROM nobsc_recipe_types\n                 WHERE recipe_type_id = ?",e.next=5,pool.execute(u,[a]);case 5:c=e.sent,o=(0,i.default)(c,1),s=o[0],n.send(s),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0),console.log(e.t0);case 14:case"end":return e.stop()}},e,void 0,[[0,11]])}));return function(t,n){return e.apply(this,arguments)}}()),c.get("/by-type/:id",function(){var e=(0,a.default)(r.default.mark(function e(t,n){var a,u,c,o,s;return r.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a=t.params.id,u="SELECT recipe_id, recipe_name, recipe_type_id, recipe_image\n                 FROM nobsc_recipes\n                 WHERE recipe_type_id = ?",e.next=5,pool.execute(u,[a]);case 5:c=e.sent,o=(0,i.default)(c,1),s=o[0],n.send(s),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0),console.log(e.t0);case 14:case"end":return e.stop()}},e,void 0,[[0,11]])}));return function(t,n){return e.apply(this,arguments)}}()),e.exports=c},function(e,t,n){"use strict";var r=u(n(3)),i=u(n(2)),a=u(n(1));function u(e){return e&&e.__esModule?e:{default:e}}var c=n(0),o=n(4),s=c.Router(),p=o.createPool({host:process.env.RDS_HOSTNAME,user:process.env.RDS_USERNAME,password:process.env.RDS_PASSWORD,database:process.env.RDS_DB_NAME,waitForConnections:process.env.DB_WAIT_FOR_CONNECTIONS,connectionLimit:process.env.DB_CONNECTION_LIMIT,queueLimit:process.env.DB_QUEUE_LIMIT});s.get("/",function(){var e=(0,a.default)(r.default.mark(function e(t,n){var a,u,c,o;return r.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a="SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image\n                 FROM nobsc_ingredients",e.next=4,p.execute(a);case 4:u=e.sent,c=(0,i.default)(u,1),o=c[0],n.send(o),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(0),console.log(e.t0);case 13:case"end":return e.stop()}},e,void 0,[[0,10]])}));return function(t,n){return e.apply(this,arguments)}}()),s.get("/:id",function(){var e=(0,a.default)(r.default.mark(function e(t,n){var a,u,c,o,s;return r.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a=t.params.id,u="SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image\n                 FROM nobsc_ingredients\n                 WHERE ingredient_id = ?",e.next=5,p.execute(u,[a]);case 5:c=e.sent,o=(0,i.default)(c,1),s=o[0],n.send(s),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0),console.log(e.t0);case 14:case"end":return e.stop()}},e,void 0,[[0,11]])}));return function(t,n){return e.apply(this,arguments)}}()),s.get("/types/all",function(){var e=(0,a.default)(r.default.mark(function e(t,n){var a,u,c,o;return r.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a="SELECT ingredient_type_id, ingredient_type_name\n                 FROM nobsc_ingredient_types",e.next=4,p.execute(a);case 4:u=e.sent,c=(0,i.default)(u,1),o=c[0],console.log(o),n.send(o),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0),console.log(e.t0);case 14:case"end":return e.stop()}},e,void 0,[[0,11]])}));return function(t,n){return e.apply(this,arguments)}}()),s.get("/types/:id",function(){var e=(0,a.default)(r.default.mark(function e(t,n){var a,u,c,o,s;return r.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a=t.params.id,u="SELECT ingredient_type_id, ingredient_type_name\n                 FROM nobsc_ingredient_types\n                 WHERE ingredient_type_id = ?",e.next=5,p.execute(u,[a]);case 5:c=e.sent,o=(0,i.default)(c,1),s=o[0],n.send(s),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0),console.log(e.t0);case 14:case"end":return e.stop()}},e,void 0,[[0,11]])}));return function(t,n){return e.apply(this,arguments)}}()),s.get("/by-type/:id",function(){var e=(0,a.default)(r.default.mark(function e(t,n){var a,u,c,o,s;return r.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a=t.params.id,u="SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image\n                 FROM nobsc_ingredients\n                 WHERE ingredient_type_id = ?",e.next=5,p.execute(u,[a]);case 5:c=e.sent,o=(0,i.default)(c,1),s=o[0],n.send(s),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0),console.log(e.t0);case 14:case"end":return e.stop()}},e,void 0,[[0,11]])}));return function(t,n){return e.apply(this,arguments)}}()),e.exports=s},function(e,t,n){"use strict";var r=u(n(3)),i=u(n(2)),a=u(n(1));function u(e){return e&&e.__esModule?e:{default:e}}var c=n(0).Router();c.get("/",function(){var e=(0,a.default)(r.default.mark(function e(t,n){var a,u,c,o;return r.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a="SELECT equipment_id, equipment_name, equipment_type_id, equipment_image\n                 FROM nobsc_equipment",e.next=4,pool.execute(a);case 4:u=e.sent,c=(0,i.default)(u,1),o=c[0],n.send(o),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(0),console.log(e.t0);case 13:case"end":return e.stop()}},e,void 0,[[0,10]])}));return function(t,n){return e.apply(this,arguments)}}()),c.get("/:id",function(){var e=(0,a.default)(r.default.mark(function e(t,n){var a,u,c,o,s;return r.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a=t.params.id,u="SELECT equipment_id, equipment_name, equipment_type_id, equipment_image\n                 FROM nobsc_equipment\n                 WHERE equipment_id = ?",e.next=5,pool.execute(u,[a]);case 5:c=e.sent,o=(0,i.default)(c,1),s=o[0],n.send(s),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0),console.log(e.t0);case 14:case"end":return e.stop()}},e,void 0,[[0,11]])}));return function(t,n){return e.apply(this,arguments)}}()),c.get("/types",function(){var e=(0,a.default)(r.default.mark(function e(t,n){var a,u,c,o;return r.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a="SELECT equipment_type_id, equipment_type_name\n                 FROM nobsc_equipment_types",e.next=4,pool.execute(a);case 4:u=e.sent,c=(0,i.default)(u,1),o=c[0],n.send(o),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(0),console.log(e.t0);case 13:case"end":return e.stop()}},e,void 0,[[0,10]])}));return function(t,n){return e.apply(this,arguments)}}()),c.get("/types/:id",function(){var e=(0,a.default)(r.default.mark(function e(t,n){var a,u,c,o,s;return r.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a=t.params.id,u="SELECT equipment_type_id, equipment_type_name\n                 FROM nobsc_equipment_types\n                 WHERE equipment_type_id = ?",e.next=5,pool.execute(u,[a]);case 5:c=e.sent,o=(0,i.default)(c,1),s=o[0],n.send(s),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0),console.log(e.t0);case 14:case"end":return e.stop()}},e,void 0,[[0,11]])}));return function(t,n){return e.apply(this,arguments)}}()),c.get("/by-type/:id",function(){var e=(0,a.default)(r.default.mark(function e(t,n){var a,u,c,o,s;return r.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a=t.params.id,u="SELECT equipment_id, equipment_name, equipment_type_id, equipment_image\n                 FROM nobsc_equipment\n                 WHERE equipment_type_id = ?",e.next=5,pool.execute(u,[a]);case 5:c=e.sent,o=(0,i.default)(c,1),s=o[0],n.send(s),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0),console.log(e.t0);case 14:case"end":return e.stop()}},e,void 0,[[0,11]])}));return function(t,n){return e.apply(this,arguments)}}()),e.exports=c},function(e,t){e.exports=require("body-parser")},function(e,t){e.exports=require("helmet")},function(e,t){e.exports=require("cors")},function(e,t){e.exports=require("compression")},function(e,t){e.exports=require("dotenv")},function(e,t,n){"use strict";n(12).config();var r=n(0),i=n(4),a=n(11),u=n(10),c=n(9),o=n(8),s=n(7),p=n(6),d=n(5),f=r();i.createPool({host:process.env.RDS_HOSTNAME,user:process.env.RDS_USERNAME,password:process.env.RDS_PASSWORD,database:process.env.RDS_DB_NAME,waitForConnections:process.env.DB_WAIT_FOR_CONNECTIONS,connectionLimit:process.env.DB_CONNECTION_LIMIT,queueLimit:process.env.DB_QUEUE_LIMIT});f.use(a()),f.use(u()),f.use(c()),f.use(o.urlencoded({extended:!1})),f.use(o.json()),f.get("/",function(e,t){try{t.send("No Bullshit Cooking Backend API")}catch(e){console.log(e)}}),f.use("/equipment",s),f.use("/ingredients",p),f.use("/recipes",d),f.use(function(e,t,n){var r=new Error("Not found");r.status=404,n(r)}),f.use(function(e,t,n,r){n.status(e.status||500),n.json({error:{message:e.message}})});var l=process.env.PORT||3003;f.listen(l,function(){return console.log("Listening on port "+l)})}]);