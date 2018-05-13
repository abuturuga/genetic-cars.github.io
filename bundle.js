!function(t){var i={};function s(e){if(i[e])return i[e].exports;var o=i[e]={i:e,l:!1,exports:{}};return t[e].call(o.exports,o,o.exports,s),o.l=!0,o.exports}s.m=t,s.c=i,s.d=function(t,i,e){s.o(t,i)||Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:e})},s.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},s.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(i,"a",i),i},s.o=function(t,i){return Object.prototype.hasOwnProperty.call(t,i)},s.p="",s(s.s=0)}([function(t,i,s){"use strict";s.r(i);class e{constructor(){this._zoom=1,this._position={x:0,y:0}}static getInstance(){return this._instance?this._instance:(this._instance=new e,this._instance)}get position(){const{x:t,y:i}=this._position;return{x:t*this._zoom,y:i*this._zoom}}set position(t){this._position=t}get zoom(){return this._zoom}set zoom(t){this._zoom=t}}const o={canvasConfig:{width:window.innerWidth,height:window.innerHeight,selector:"#canvas"},gravity:-9.8,scale:1,fps:60};class n{constructor(t){this.config=t,this._bodyDef=new Box2D.Dynamics.b2BodyDef,this._bodyDef.type=Box2D.Dynamics.b2Body.b2_dynamicBody,this._vertices=[]}get vertices(){return this._vertices}get body(){return this._body}setPosition(t=0,i=0){this._bodyDef.position.Set(t,i)}attachToWorld(t){this._body=t.CreateBody(this._bodyDef)}init(){this.buildVertices(this.config.points);const{length:t}=this._vertices;for(let i=0;i<t-1;i++)this.bindPart(this._vertices[i],this._vertices[i+1]);this.bindPart(this._vertices[t-1],this._vertices[0])}buildVertices(t){const{b2Vec2:i}=Box2D.Common.Math;this._vertices.push(new i(t[0],0)),this._vertices.push(new i(t[1],t[2])),this._vertices.push(new i(0,t[3])),this._vertices.push(new i(-t[4],t[5])),this._vertices.push(new i(-t[6],0)),this._vertices.push(new i(-t[7],-t[8])),this._vertices.push(new i(0,-t[9])),this._vertices.push(new i(t[10],-t[11]))}createPart(t,i){const s=[];s.push(t),s.push(i),s.push(Box2D.Common.Math.b2Vec2.Make(0,0));const e=Box2D.Collision.Shapes.b2PolygonShape.AsArray(s,3),o=new Box2D.Dynamics.b2FixtureDef;return o.density=1,o.friction=.5,o.restitution=.5,o.filter.groupIndex=-1,o.shape=e,o}bindPart(t,i){const s=this.createPart(t,i);this._body.CreateFixture(s)}}class h{constructor(t){this.config=t,this._bodyDef=new Box2D.Dynamics.b2BodyDef,this._fixDef=new Box2D.Dynamics.b2FixtureDef,this._bodyDef.type=Box2D.Dynamics.b2Body.b2_dynamicBody}get body(){return this._body}get radius(){return this.config.radius}vertexIndex(){return this.config.vertex}setPosition(t,i){this._bodyDef.position.Set(t,i)}attachToWorld(t){this._body=t.CreateBody(this._bodyDef)}init(){this._fixDef=new Box2D.Dynamics.b2FixtureDef,this._fixDef.shape=new Box2D.Collision.Shapes.b2CircleShape(this.config.radius),this._fixDef.density=1,this._fixDef.friction=.5,this._fixDef.restitution=.5,this._fixDef.filter.groupIndex=-1,this._body.CreateFixture(this._fixDef)}}class r{constructor(t){this.config=t,this._carMass=0}setCarMass(t){this._carMass=t}attach(t,i,s){t.forEach(t=>{const e=new Box2D.Dynamics.Joints.b2RevoluteJointDef,n=this._carMass*-o.gravity/t.radius,h=i.vertices[t.vertexIndex()];e.localAnchorA.Set(h.x,h.y),e.localAnchorB.Set(0,0),e.bodyA=i.body,e.bodyB=t.body,e.maxMotorTorque=n,e.motorSpeed=this.config.motorSpeed,e.enableMotor=!0,s.CreateJoint(e)})}}class a{constructor(t){this.config=t,this._carMass=0,this._chassis=new n(t.chassis),this._engine=new r(t.engine),this.initState()}attachToWorld(t){const{x:i,y:s}=this.config.position;this._chassis.setPosition(i,s),this._chassis.attachToWorld(t),this.init(),this.buildWheels(t),this.computeCarMass(),this._engine.setCarMass(this._carMass),this._engine.attach(this._wheels,this._chassis,t)}getPosition(){return this._chassis.body.GetPosition()}update(){const{x:t,y:i}=this.getPosition(),s=this.updateAltitude(i);t>this._state.maxPosition.x+.01?(this._state.health=this.config.maxHealth,this._state.maxPosition.x=t):s||(this._chassis.body.GetLinearVelocity().x<.001?this._state.health-=5:this._state.health--)}isAlive(){return this._state.health>0}destroy(t){t.DestroyBody(this._chassis.body),this._wheels.forEach(i=>{t.DestroyBody(i.body)})}updateAltitude(t){return t>this._state.maxPosition.y?(this._state.maxPosition.y=t,!0):t<this._state.minPosition.y&&(this._state.minPosition.y=t,!0)}initState(){this._state={health:this.config.maxHealth,maxPosition:{x:0,y:0},minPosition:{x:0,y:0}}}buildWheels(t){const{x:i,y:s}=this.config.position;this._wheels=this.config.wheels.map(e=>{const o=new h(e);return o.setPosition(i,s),o.attachToWorld(t),o.init(),o})}init(){this._chassis.init()}computeCarMass(){this._carMass=this._chassis.body.GetMass(),this._carMass+=this._wheels.reduce((t,i)=>t+=i.body.GetMass(),0)}}const c=new class{constructor(t){this._element=document.querySelector(t.selector),this._width=t.width,this._height=t.height,this._camera=e.getInstance(),this.init()}set width(t){this._width=t}get width(){return this._width}set height(t){this.height=t}get height(){return this.height}get ctx(){return this._ctx}draw(t){this._ctx.clearRect(0,0,this._width,this._height),this._ctx.fillStyle="#FFF4C9",this._ctx.fillRect(0,0,this._width,this._height),this._ctx.save(),this.setCamera(),t.DrawDebugData(),this._ctx.restore()}setCamera(){const t=this._width/2-this._camera.position.x,i=this._height-this._camera.position.y;this._ctx.translate(t,i);const s=this._camera.zoom;this._ctx.scale(s,-s)}init(){this._element.width=this._width,this._element.height=this._height,this._ctx=this._element.getContext("2d")}}(o.canvasConfig),l=new class{constructor(t,i){this.ctx=t,this.scale=i,this._doSleep=!0,this._gravity=new Box2D.Common.Math.b2Vec2(0,o.gravity),this._world=new Box2D.Dynamics.b2World(this._gravity,this._doSleep),this.setDebugDraw()}get world(){return this._world}step(t){this._world.Step(t,8,3),this._world.ClearForces()}setDebugDraw(){const{b2DebugDraw:t}=Box2D.Dynamics,i=new t;i.SetSprite(this.ctx),i.SetDrawScale(this.scale),i.SetFillAlpha(.5),i.SetFlags(t.e_shapeBit|t.e_jointBit),this._world.SetDebugDraw(i)}}(c.ctx,o.scale),d=e.getInstance();function _(t=0,i){return t=Math.ceil(t),i=Math.floor(i),Math.floor(Math.random()*(i-t))+t}function u(){const t=new a({maxHealth:10*o.fps,position:{x:100,y:300},chassis:{points:Array(12).fill(0).map(t=>100*Math.random())},engine:{motorSpeed:-20},wheels:[{radius:_(30,60),vertex:_(0,7)},{radius:_(30,60),vertex:_(0,7)}]});return t.attachToWorld(l.world),t}new class{constructor(t){this.config=t}build(t){let i,s=new Box2D.Common.Math.b2Vec2(-this.config.windowWidth/2,100);for(let e=0;e<this.config.maxTiles;e++){let o=1.5*(3*Math.random()-1.5)*e/this.config.maxTiles,n=(i=this.createTile(s,o,this.config.dimension,t)).GetFixtureList().GetShape();s=i.GetWorldPoint(n.m_vertices[3])}}createTile(t,i,s,e){const o=new Box2D.Dynamics.b2BodyDef;o.position.Set(t.x,t.y);let n=this.buildTileVertices(s,i,{x:0,y:0});const h=Box2D.Collision.Shapes.b2PolygonShape.AsArray(n,n.length),r=new Box2D.Dynamics.b2FixtureDef;r.shape=h,r.friction=.5;const a=e.CreateBody(o);return a.CreateFixture(r),a}buildTileVertices(t,i,s){const e=[],{b2Vec2:o}=Box2D.Common.Math;return e.push(new o(0,0)),e.push(new o(0,-t.y)),e.push(new o(t.x,-t.y)),e.push(new o(t.x,0)),this.rotateTile(e,s,i)}rotateTile(t,i,s){const{b2Vec2:e}=Box2D.Common.Math;return t.map(t=>new e(Math.cos(s)*(t.x-i.x)-Math.sin(s)*(t.y-i.y)+i.x,Math.sin(s)*(t.x-i.x)+Math.cos(s)*(t.y-i.y)+i.y))}}({maxTiles:30,dimension:{x:100,y:5},windowWidth:o.canvasConfig.width}).build(l.world);const x=Array(10).fill(0).map(t=>u());Math.round(1e3/o.fps);(new Date).getTime();window.requestAnimationFrame(function t(){const i=function(t){let i=0,s=0;return t.forEach((t,e)=>{const o=t.getPosition();s<o.x&&(s=o.x,i=e)}),t[i]}(x);i&&(d.position=i.getPosition()),console.log(1/o.fps),l.step(1/o.fps),c.draw(l.world),window.requestAnimationFrame(t)})}]);