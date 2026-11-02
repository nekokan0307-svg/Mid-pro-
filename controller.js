(()=>{
const $=id=>document.getElementById(id);let wakeLock=null;
async function keepAwake(){try{if(!('wakeLock' in navigator))throw Error('This browser does not support Screen Wake Lock');wakeLock=await navigator.wakeLock.request('screen');$('wake-status').textContent='✓ Screen Wake Lock is active · keep the phone unlocked';wakeLock.addEventListener('release',()=>{$('wake-status').textContent='⚠ Screen Wake Lock released · tap Keep Screen Awake again'})}catch(e){$('wake-status').textContent='⚠ '+e.message+' · set a longer screen timeout in phone settings'}}
$('wake').onclick=keepAwake;
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&wakeLock&&!wakeLock.released)return;if(!document.hidden&&enabled)keepAwake()});let peer=null,conn=null,enabled=false,base=0,filtered=0,lastPulse=0,seq=0,count=0,side='left',lastSend=0,lastMotion=0,events=0;
function status(s){$('status').textContent=s}
const pairedCode=new URLSearchParams(location.search).get('pair');if(pairedCode&&/^fb-[a-z0-9]{6}-[a-z0-9]{3}$/.test(pairedCode)){$('pair').value=pairedCode;status('✓ Pair Code filled from QR · tap Connect')}
$('connect').onclick=()=>{
 const code=$('pair').value.trim();if(!/^fb-[a-z0-9]{6}-[a-z0-9]{3}$/.test(code)){status('Enter the Pair Code shown on your computer');return}
 if(typeof Peer==='undefined'){status('PeerJS load failed; check internet');return}
 if(peer)peer.destroy();peer=new Peer();status('Connecting…');peer.on('open',()=>{conn=peer.connect(code,{reliable:false});conn.on('open',()=>{status('✓ Connected to FITBEAT');$('net').textContent='Online'});conn.on('data',d=>{if(d?.type==='config'){side=d.side;$('side').textContent=side.toUpperCase()}});conn.on('close',()=>{status('Connection closed');$('net').textContent='Offline'});conn.on('error',()=>status('Connection error'))});peer.on('error',e=>status('Peer error: '+e.type));
};
function onMotion(e){
 const a=e.acceleration,g=e.accelerationIncludingGravity;
 if(!a&&!g)return;
 const usable=a&&[a.x,a.y,a.z].some(v=>typeof v==='number');
 const source=usable?a:g;if(!source)return;
 let energy=Math.hypot(Number(source.x)||0,Number(source.y)||0,Number(source.z)||0);
 if(!usable){base=base*.92+energy*.08;energy=Math.abs(energy-base)}
 filtered=.45*filtered+.55*energy;
 const now=performance.now();lastMotion=now;events++;
 const punch=filtered>1.25&&now-lastPulse>260;
 if(punch){lastPulse=now;count++;$('count').textContent=String(count)}
 $('motion').textContent=filtered.toFixed(2)+' m/s² · '+events+' samples';
 if(conn?.open&&(now-lastSend>65||punch)){lastSend=now;conn.send({type:'motion',seq:++seq,energy:filtered,punch,side})}
}
setInterval(()=>{
 if(!enabled)return;
 if(document.hidden){status('⚠ App is in the background — motion tracking may pause');return}
 if(performance.now()-lastMotion>2500)status('⚠ No motion data: check permissions and tap Enable Motion Sensor again');
},1500);
$('enable').onclick=async()=>{try{
 if(!window.isSecureContext)throw Error('Open this page over HTTPS or localhost');
 if(typeof DeviceMotionEvent==='undefined')throw Error('Motion sensor is not supported on this device');
 if(typeof DeviceMotionEvent.requestPermission==='function'){const r=await DeviceMotionEvent.requestPermission();if(r!=='granted')throw Error('Motion permission denied')}
 if(!enabled){window.addEventListener('devicemotion',onMotion);enabled=true}lastMotion=performance.now();await keepAwake();status('✓ Motion sensor enabled · move the phone to check the live intensity');
 }catch(e){status('⚠ '+e.message)}};
$('calibrate').onclick=()=>{filtered=0;base=0;lastPulse=performance.now();status('Motion baseline reset')};
})();