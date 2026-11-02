/* FITBEAT V4.1 — stable setup navigation; no MutationObserver loop. */
(()=>{
 'use strict';
 const main=document.querySelector('main.shell');
 const controls=document.getElementById('sensor-controls');
 if(!main||!controls)return;
 const page=document.createElement('section');
 page.id='sensor-setup';
 page.className='screen';
 page.innerHTML=`<div class="sensor-setup-shell">
 <h2>How to Play & Set Up</h2>
 <p>Follow these steps before your first workout.</p><div class="setup-guide"><article><b>1 · Choose your controls</b><p>Use your webcam to detect UP, DOWN, SIDE and TWIST & PUNCH arm poses. For keyboard practice: LEFT ARM = 1 / 2 / 3 / 4; RIGHT ARM = Q / W / E / R (Up / Side / Twist & Punch / Down).</p></article><article><b>2 · Set up your camera</b><p>Allow camera access, stand far enough back to show your upper body and both arms, and make sure the room is bright. Keep your full arms in frame. Click Start Camera below.</p></article><article><b>3 · Pair a phone (optional)</b><p>Choose which arm holds the phone, select Create Pair Code, then scan the QR code or open the Phone Controller on your phone. Tap Connect and Enable Motion Sensor. Keep your phone screen awake.</p></article><article><b>4 · Play safely</b><p>Follow the colored motion icons as they approach the target. Move only the arm named above the lane. Take breaks if you feel dizzy or uncomfortable. Phone sensor assistance is experimental; camera and keyboard remain available.</p></article></div>
 <div id="sensor-devices" class="sensor-devices"></div>
 <div class="sensor-preview-actions"><label><input type="checkbox" id="sensor-preview-toggle"> Show camera preview during setup</label></div>
 <div class="sensor-setup-footer"><button type="button" id="sensor-setup-levels">Choose Workout</button><button type="button" id="sensor-setup-home" class="secondary">← Home</button></div>
 <p class="sensor-note">Camera tracking continues during play; the video preview stays hidden unless enabled here.</p></div>`;
 main.append(page);
 const devices=page.querySelector('#sensor-devices');
 devices.append(controls);
 const dual=document.querySelector('.dual-panel');
 if(dual)devices.append(dual);
 const video=document.getElementById('camera-video');
 const preview=document.createElement('div');
 preview.id='sensor-camera-preview';preview.className='sensor-camera-preview';
 controls.append(preview);
 if(video)preview.append(video);
 const checkbox=document.getElementById('sensor-preview-toggle');
 const updatePreview=()=>preview.classList.toggle('enabled',checkbox.checked&&page.classList.contains('active'));
 checkbox.addEventListener('change',updatePreview);
 function openSetup(){
   document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
   page.classList.add('active');updatePreview();
 }
 // game.js has already registered its menu handler; run after it to activate this late-added screen.
 document.querySelectorAll('[data-screen="sensor-setup"]').forEach(b=>b.addEventListener('click',openSetup));
 document.getElementById('open-sensor-setup')?.addEventListener('click',openSetup);
 function goTo(id){
   // Existing game.js navigation handles game lifecycle, music and animation.
   const b=[...document.querySelectorAll('[data-screen]')].find(el=>el.dataset.screen===id&&el.id!=='open-sensor-setup');
   if(b){b.click();page.classList.remove('active');updatePreview();return;}
   document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id));updatePreview();
 }
 document.getElementById('sensor-setup-levels').addEventListener('click',()=>goTo('levels'));
 document.getElementById('sensor-setup-home').addEventListener('click',()=>goTo('home'));
})();
