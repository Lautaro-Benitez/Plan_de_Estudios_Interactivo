"use strict";
/* ─── storage con fallback a memoria ─── */
var mem={};
var storageOK=(function(){
  try{
    var k='__pe_test__'+Date.now();
    localStorage.setItem(k,'1');
    var v=localStorage.getItem(k);
    localStorage.removeItem(k);
    return v==='1';
  }catch(e){return false;}
})();
var store={
  get:function(k){try{var v=localStorage.getItem(k);return v==null?null:JSON.parse(v);}catch(e){return k in mem?mem[k]:null;}},
  set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){mem[k]=v;}}
};
var uid=function(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7);};

var PERIODS={bimestre:{label:'Bimestre',cols:6},trimestre:{label:'Trimestre',cols:3},semestre:{label:'Semestre',cols:2},cuatrimestre:{label:'Cuatrimestre',cols:2}};
var APP_VERSION='1.7.0';
var DATA_VERSION=3;
// ─────────────────────────────────────────────────────────────────────────
// Novedades por versión (más reciente primero). Alineado con CHANGELOG.md
//
// PARA AGREGAR UNA NUEVA VERSIÓN:
//   1) Subir APP_VERSION arriba (ej. '1.2.0').
//   2) Agregar un objeto nuevo AL INICIO de este array con la forma:
//      {v:'1.2.0', fecha:'AAAA-MM-DD', titulo:'...', cambios:[...]}
//   3) Actualizar CHANGELOG.md con la misma información.
//
// Al recargar, los usuarios verán el modal con todas las versiones que se
// hayan saltado desde su última visita. NO se tocan sus datos guardados.
// ─────────────────────────────────────────────────────────────────────────
var CHANGES_BY_VERSION=[
  {v:'1.7.0',fecha:'2026-07-06',titulo:'Soporte PWA (Progressive Web App)',cambios:[
    'La aplicación ahora se puede instalar en dispositivos móviles y de escritorio (PWA).',
    'Se añadió un Service Worker que permite utilizar la aplicación sin conexión (offline).',
    'Se agregó un aviso (prompt) nativo para instalar la app desde el navegador.'
  ]},
  {v:'1.6.0',fecha:'2026-07-03',titulo:'Extracción de scripts, correcciones de importación',cambios:[
    'Archivos CSS y JavaScript separados del archivo HTML principal para un código más limpio.',
    'Se agregaron nuevos badges informativos en el README y se actualizó el control de versiones.',
    'Corrección: retrocompatibilidad agregada para la importación de JSONs antiguos, asegurando que la configuración general se aplique correctamente al importar.'
  ]},
  {v:'1.5.0',fecha:'2026-06-11',titulo:'Historial accesible, colapso real y correcciones',cambios:[
    'Nuevo botón "Ayuda" en el footer, ahora con estilo de botón azul pequeño.',
    'Acceso al historial completo de versiones desde el modal "Acerca de".',
    'El colapso de columnas ahora reduce realmente el ancho a la mínima expresión (40 px), no solo el contenido.',
    'Corrección: el hover sobre la versión del footer ahora se activa solo al pasar sobre el texto, no sobre todo el footer.',
    'Corrección: las materias aprobadas por equivalencia ya no reciben automáticamente la nota 7. Si se elimina la nota, queda sin valor y no afecta el promedio.'
  ]},
  {v:'1.4.0',fecha:'2026-06-11',titulo:'Guía de inicio y botones de color',cambios:[
    'Modal de bienvenida con guía paso a paso al iniciar la app por primera vez.',
    'Botón flotante de ayuda (?) en la esquina inferior derecha para reabrir la guía en cualquier momento.',
    'Botones principales ahora con colores distintivos: Agregar materia en verde, Configuración en azul, Generar con IA en amarillo.',
    'En mobile, el modal "Generar con IA" permite ver el prompt mucho más cómodamente con scroll y mayor altura.'
  ]},
  {v:'1.3.0',fecha:'2026-06-11',titulo:'Mejoras de UI y exportación a PDF',cambios:[
    '"Acerca de" se abre haciendo click en la versión del footer (botón quitado del sidebar).',
    'Colapsar columnas y filas con click directo en el encabezado, sin botones extra.',
    'Importar y Exportar JSON se centralizan en el modal Configuración (botones quitados del sidebar).',
    'Botones unificados visualmente en todos los modales: "Cancelar" como secundario y acciones primarias con el mismo estilo.',
    'Los botones de los modales siempre quedan a la derecha en una sola fila (con mejor distribución y tamaño en mobile).',
    'Footer centrado en mobile y modales siempre centrados verticalmente en pantalla.',
    'Exportación a PDF mejorada: nuevo modal de opciones para elegir orientación A4 (horizontal o vertical), con estilos optimizados para impresión.',
    'Sin emojis en los botones; se usan etiquetas de texto consistentes.'
  ]},
  {v:'1.2.0',fecha:'2026-06-11',titulo:'Equivalencia, generador IA y colapso',cambios:[
    'Nueva opción "Aprobada por equivalencia" en las materias: si no tiene nota cargada, no afecta el promedio.',
    'Generador de plan con IA: el botón "Generar con IA" del sidebar entrega un prompt listo para pegar en cualquier IA y obtener el JSON.',
    'Colapso de columnas (períodos) y filas (años) completas con un click en cada encabezado. El estado se recuerda entre sesiones.',
    'Badge "EQUIV" en las tarjetas marcadas como equivalencia.'
  ]},
  {v:'1.1.0',fecha:'2026-06-11',titulo:'Mobile y modal Acerca de',cambios:[
    'Soporte completo para dispositivos móviles con sidebar a pantalla completa.',
    'Botón hamburguesa en el topbar para abrir el panel lateral.',
    'Grilla del plan reorganizada en una sola columna en celulares.',
    'Modales y toasts adaptados a pantallas chicas.',
    'Nuevo modal "Acerca de" con enlaces al README y la licencia.',
    'Las nuevas instalaciones arrancan sin materias precargadas.',
    'Aviso automático de novedades al actualizar a una versión nueva.'
  ]},
  {v:'1.0.0',fecha:'2026-05-28',titulo:'Primera versión pública',cambios:[
    'Gestión completa de materias: alta, edición, duplicación y eliminación.',
    'Correlatividades con detección de ciclos y resaltado de la red.',
    'Cinco estados: Pendiente, En curso, Regularizada, Aprobada, Libre.',
    'Múltiples notas por materia con promedio con y sin aplazos.',
    'Barra de progreso con corredor animado.',
    'Exportación a JSON y PDF, drag & drop, deshacer eliminación.'
  ]}
];
// estados de cursada (orden de avance)
var ESTADOS=['pendiente','en_curso','regularizada','aprobada'];
var ESTADO_LABEL={pendiente:'Pendiente',en_curso:'En curso',regularizada:'Regularizada',aprobada:'Aprobada',libre:'Libre',bloqueada:'Bloqueada'};

/* ─── estado ─── */
var DEFAULT_CONFIG={carrera:'',estudiante:'',facultad:'',universidad:'',ingreso:'',egreso:'',anios:3,medioAnio:false,tipoPeriodo:'cuatrimestre'};
var materias=migrar(store.get('pe2_materias'));
var config=Object.assign({},DEFAULT_CONFIG,store.get('pe2_config')||{});
if(!materias){materias=[];}
var seleccionada=null, collapsed=false, filtro='', filtroEstado='', undoStack=null, dragId=null;
var collapsedYears=store.get('pe2_collapsedYears')||[];
var collapsedCols=store.get('pe2_collapsedCols')||[];
function toggleYearCollapse(a){
  var i=collapsedYears.indexOf(a);
  if(i>=0)collapsedYears.splice(i,1);else collapsedYears.push(a);
  store.set('pe2_collapsedYears',collapsedYears);render();
}
function toggleColCollapse(p){
  var i=collapsedCols.indexOf(p);
  if(i>=0)collapsedCols.splice(i,1);else collapsedCols.push(p);
  store.set('pe2_collapsedCols',collapsedCols);render();
}

function save(){store.set('pe2_materias',materias);store.set('pe2_config',config);}

// migración de datos viejos (aprobada/nota → estado/notas)
function migrar(arr){
  if(!arr)return null;
  return arr.map(function(m){
    var mm=Object.assign({},m);
    if(!mm.estado){mm.estado=mm.aprobada?'aprobada':'pendiente';}
    if(!Array.isArray(mm.notas)){mm.notas=(mm.nota!=null)?[mm.nota]:[];}
    if(mm.regVence===undefined)mm.regVence='';
    if(mm.equivalencia===undefined)mm.equivalencia=false;
    delete mm.aprobada;delete mm.nota;
    return mm;
  });
}

/* ─── seed ─── */
function seed(){
  function m(o){return{id:uid(),nombre:o.n,anio:o.a,periodo:o.p,anual:!!o.anual,tipo:o.tipo||'obligatoria',peso:o.peso!=null?o.peso:(o.tipo==='optativa'?0.5:1),promocionable:o.pro!==false,regularizable:o.reg!==false,estado:o.estado||(o.ap?'aprobada':'pendiente'),notas:o.nota!=null?[o.nota]:[],regVence:o.regVence||'',profesor:o.prof||'',fecha:o.fecha||'',obs:'',correlativas:[]};}
  var L=[
    m({n:'Álgebra',a:1,p:1,ap:true,nota:8,prof:'Dra. Pérez'}),
    m({n:'Análisis Matemático I',a:1,p:1,ap:true,nota:7,prof:'Ing. Gómez'}),
    m({n:'Introducción a la Programación',a:1,p:1,ap:true,nota:9,prof:'Lic. Ruiz'}),
    m({n:'Análisis Matemático II',a:1,p:2,estado:'regularizada',regVence:'2026-08-31'}),
    m({n:'Programación Orientada a Objetos',a:1,p:2,ap:true,nota:8.5}),
    m({n:'Inglés Técnico',a:1,p:1,anual:true,tipo:'obligatoria',pro:false}),
    m({n:'Estructuras de Datos',a:2,p:1,estado:'en_curso'}),
    m({n:'Bases de Datos',a:2,p:1}),
    m({n:'Probabilidad y Estadística',a:2,p:2}),
    m({n:'Sistemas Operativos',a:2,p:2}),
    m({n:'Ingeniería de Software',a:3,p:1}),
    m({n:'Redes de Computadoras',a:3,p:1}),
    m({n:'Inteligencia Artificial',a:3,p:2,tipo:'optativa',peso:0.5,pro:false})
  ];
  function id(n){return L.filter(function(x){return x.nombre===n;})[0].id;}
  function dep(n,ds){L.filter(function(x){return x.nombre===n;})[0].correlativas=ds.map(id);}
  dep('Análisis Matemático II',['Análisis Matemático I']);
  dep('Programación Orientada a Objetos',['Introducción a la Programación']);
  dep('Estructuras de Datos',['Programación Orientada a Objetos']);
  dep('Bases de Datos',['Programación Orientada a Objetos']);
  dep('Probabilidad y Estadística',['Análisis Matemático II','Álgebra']);
  dep('Sistemas Operativos',['Estructuras de Datos']);
  dep('Ingeniería de Software',['Bases de Datos','Estructuras de Datos']);
  dep('Redes de Computadoras',['Sistemas Operativos']);
  dep('Inteligencia Artificial',['Probabilidad y Estadística','Estructuras de Datos']);
  return L;
}

/* ─── helpers ─── */
function byId(id){return materias.filter(function(m){return m.id===id;})[0];}
function esAprobada(m){return m.estado==='aprobada';}
function notaFinal(m){
  // nota que cuenta para el promedio: la última nota cargada (la final)
  if(!m.notas||!m.notas.length)return null;
  return m.notas[m.notas.length-1];
}
function estado(m){
  if(m.estado==='aprobada')return'aprobada';
  // si está regularizada pero la fecha ya venció → libre
  if(m.estado==='regularizada'&&m.regVence&&venceInfo(m.regVence).vencida)return'libre';
  var faltan=m.correlativas.some(function(c){var x=byId(c);return x&&!esAprobada(x);});
  if(faltan)return'bloqueada';
  return m.estado||'pendiente';
}
function ancestros(id){var out={},stack=(byId(id)?byId(id).correlativas:[]).slice();while(stack.length){var c=stack.pop();if(!out[c]){out[c]=1;var x=byId(c);if(x)x.correlativas.forEach(function(k){stack.push(k);});}}return out;}
function descendientes(id){var out={},stack=[id];while(stack.length){var c=stack.pop();materias.forEach(function(m){if(m.correlativas.indexOf(c)>=0&&!out[m.id]){out[m.id]=1;stack.push(m.id);}});}return out;}
function redDe(id){if(!id)return null;var a=ancestros(id),d=descendientes(id),set={};Object.keys(a).forEach(function(k){set[k]=1;});Object.keys(d).forEach(function(k){set[k]=1;});set[id]=1;return{set:set,ap:byId(id)?esAprobada(byId(id)):false};}
function nombreDuplicado(nombre,exceptId){var n=nombre.trim().toLowerCase();return materias.some(function(m){return m.id!==exceptId&&m.nombre.trim().toLowerCase()===n;});}

function promedio(conAplazos){
  var num=0,den=0;
  materias.forEach(function(m){
    if(!esAprobada(m))return;
    var notas=conAplazos?m.notas:m.notas.filter(function(n){return n>=4;});
    if(!notas||!notas.length){
      // sin notas que cuenten: si conAplazos usa la final si existe
      var nf=notaFinal(m);if(conAplazos&&nf!=null){num+=nf*m.peso;den+=m.peso;}
      return;
    }
    notas.forEach(function(n){num+=n*m.peso;den+=m.peso;});
  });
  return den>0?num/den:null;
}

/* ─── acciones ─── */
function cicloSiAgrego(origenId,nuevoCorrId){
  // ¿nuevoCorr depende (transitivamente) de origen? entonces agregar origen->nuevoCorr crea ciclo
  var anc=ancestros(nuevoCorrId);
  return !!anc[origenId]||nuevoCorrId===origenId;
}
function setEstado(m,nuevo){
  if(nuevo==='aprobada'){
    var falt=m.correlativas.map(byId).filter(function(c){return c&&!esAprobada(c);});
    if(falt.length){toast('No se puede aprobar: faltan correlativas → '+falt.map(function(f){return f.nombre;}).join(', '));render();return;}
    m.estado='aprobada';if(!m.notas.length)m.notas=[7];
    save();render();
  }else{
    // si baja de aprobada y es requisito de aprobadas → confirmar
    if(esAprobada(m)&&nuevo!=='aprobada'){
      var deps=materias.filter(function(x){return esAprobada(x)&&x.correlativas.indexOf(m.id)>=0;});
      if(deps.length){
        confirmar('Romper correlatividad','Estas materias aprobadas quedarían con un requisito incumplido:\n\n'+deps.map(function(d){return'• '+d.nombre;}).join('\n')+'\n\n¿Continuar?',function(){m.estado=nuevo;if(nuevo==='pendiente')m.notas=[];save();render();});
        return;
      }
    }
    m.estado=nuevo;
    if(nuevo==='pendiente'){m.notas=[];m.regVence='';}
    save();render();
  }
}
function setNotaFinal(m,raw){
  var n=parseFloat(String(raw).replace(',','.'));
  if(isNaN(n)){m.notas=[];}
  else{n=Math.max(0,Math.min(10,n));m.notas=[n];}
  save();render();
}
function eliminar(id){
  var m=byId(id);
  undoStack={tipo:'eliminar',materia:Object.assign({},m,{correlativas:m.correlativas.slice(),notas:(m.notas||[]).slice()}),vinculos:[]};
  materias.forEach(function(x){if(x.correlativas.indexOf(id)>=0)undoStack.vinculos.push(x.id);});
  materias=materias.filter(function(x){return x.id!==id;});
  materias.forEach(function(x){x.correlativas=x.correlativas.filter(function(c){return c!==id;});});
  if(seleccionada===id)seleccionada=null;
  save();render();
  toast('Materia eliminada.',{label:'Deshacer',fn:deshacer});
}
function deshacer(){
  if(!undoStack)return;
  if(undoStack.tipo==='eliminar'){
    materias.push(undoStack.materia);
    undoStack.vinculos.forEach(function(vid){var x=byId(vid);if(x&&x.correlativas.indexOf(undoStack.materia.id)<0)x.correlativas.push(undoStack.materia.id);});
  }
  undoStack=null;save();render();
}
function duplicar(m){
  var base=m.nombre+' (copia)',nombre=base,i=2;
  while(nombreDuplicado(nombre,null)){nombre=m.nombre+' (copia '+i+')';i++;}
  var copia=Object.assign({},m,{id:uid(),nombre:nombre,correlativas:m.correlativas.slice(),notas:(m.notas||[]).slice()});
  materias.push(copia);save();openModal(copia);
}

/* ─── grilla render ─── */
function render(){
  var P=PERIODS[config.tipoPeriodo],cols=P.cols;
  document.documentElement.style.setProperty('--cols',cols);
  // Template dinámico: cada columna colapsada usa 40px, las demás minmax(210px,1fr)
  var colTpl=[];
  for(var ci=1;ci<=cols;ci++){
    colTpl.push(collapsedCols.indexOf(ci)>=0?'40px':'minmax(210px,1fr)');
  }
  document.documentElement.style.setProperty('--col-template',colTpl.join(' '));
  // promedios (sin / con aplazos)
  var pr=promedio(false), prA=promedio(true);
  document.getElementById('promVal').textContent=pr!=null?pr.toFixed(2):'—';
  var apc=materias.filter(esAprobada).length;
  document.getElementById('promSub').textContent=apc+' de '+materias.length+' materias aprobadas';
  var promApEl=document.getElementById('promAplazos');
  if(promApEl)promApEl.textContent=prA!=null?('c/aplazos: '+prA.toFixed(2)):'';
  // barra de progreso en topbar
  var pct=materias.length?Math.round(apc/materias.length*100):0;
  var pb=document.getElementById('progFill');
  if(pb){
    pb.style.width=pct+'%';
    var col=pct<20?'#c23b3b':pct<50?'#e0a83a':'#1f8a52';
    pb.style.background=col;
  }
  var pr2=document.getElementById('progRunner');if(pr2)pr2.style.left='calc('+pct+'% - 13px)';
  var pl=document.getElementById('progLbl');if(pl)pl.textContent=pct+'% · '+apc+'/'+materias.length;
  // título y meta
  var totalAnios=config.anios+(config.medioAnio?0.5:0);
  var metaTxt=totalAnios+' año'+(totalAnios===1?'':'s');
  var tbMetaEl=document.getElementById('tbMeta');if(tbMetaEl)tbMetaEl.textContent=config.carrera?metaTxt:'';
  var tbC=document.getElementById('tbCarrera'),tbS=document.getElementById('tbSub'),sbC=document.getElementById('sbCarrera');
  if(config.carrera){
    tbC.firstChild.nodeValue=config.carrera+' ';
    tbC.className='';
  }else{
    tbC.firstChild.nodeValue='Carrera sin configurar ';
    tbC.className='none';
  }
  sbC.textContent=config.carrera||'Gestor de cursada';
  var subParts=[];if(config.estudiante)subParts.push(config.estudiante);if(config.facultad)subParts.push(config.facultad);if(config.universidad)subParts.push(config.universidad);
  if(subParts.length){tbS.textContent=subParts.join(' · ');tbS.className='';}else{tbS.textContent='Configurá estudiante, facultad y universidad en ⚙ Configuración';tbS.className='none';}
  var meta='';
  if(config.estudiante)meta+='<b>'+esc(config.estudiante)+'</b><br>';
  if(config.ingreso||config.egreso)meta+='Cohorte '+(config.ingreso||'?')+' – '+(config.egreso||'?');
  document.getElementById('promMeta').innerHTML=meta;document.getElementById('promMeta').style.display=meta?'block':'none';
  // print head
  var ph='';
  ph+='<h1>'+esc(config.carrera||'Plan de Estudios')+'</h1>';
  var prr=[];if(config.estudiante)prr.push('Estudiante: '+esc(config.estudiante));if(config.facultad)prr.push(esc(config.facultad));if(config.universidad)prr.push(esc(config.universidad));
  if(prr.length)ph+='<div class="pr">'+prr.join(' — ')+'</div>';
  var ppp=[];if(config.ingreso||config.egreso)ppp.push('Cohorte '+(config.ingreso||'?')+'–'+(config.egreso||'?'));
  ppp.push((config.anios+(config.medioAnio?'½':''))+' años, '+P.label.toLowerCase());ppp.push('Aprobadas: '+apc+'/'+materias.length+' ('+pct+'%)');
  if(pr!=null)ppp.push('<span class="p-prom">Promedio: '+pr.toFixed(2)+'</span>');
  if(prA!=null)ppp.push('<span class="p-prom">c/aplazos: '+prA.toFixed(2)+'</span>');
  ph+='<div class="pp">'+ppp.map(function(x){return'<span>'+x+'</span>';}).join('')+'</div>';
  document.getElementById('printHead').innerHTML=ph;

  // board
  var red=redDe(seleccionada);
  var board=document.getElementById('board');
  var html='';
  // header row con botones de colapso de columna
  html+='<div class="brow bhead"><div class="corner"></div>';
  for(var c=1;c<=cols;c++){
    var colColl=collapsedCols.indexOf(c)>=0;
    html+='<div class="colh'+(colColl?' col-collapsed':'')+'" data-col="'+c+'" data-toggle-col="'+c+'" title="Click para '+(colColl?'expandir':'colapsar')+'">'+
      '<span class="hdr-lbl">'+P.label+' '+c+'</span>'+
      '</div>';
  }
  html+='</div>';
  // construir lista de filas de año: enteras + medio año opcional
  var rows=[];
  for(var a=1;a<=config.anios;a++)rows.push({anio:a,cols:cols,label:a+'°',medio:false});
  if(config.medioAnio)rows.push({anio:config.anios+1,cols:Math.max(1,Math.ceil(cols/2)),label:'½',medio:true});
  rows.forEach(function(row){
    var a=row.anio;
    var yearColl=collapsedYears.indexOf(a)>=0;
    var anuales=materias.filter(function(m){return m.anio===a&&m.anual;}).sort(byNombre);
    var hasAnu=anuales.length>0;
    var totalMaterias=materias.filter(function(m){return m.anio===a;}).length;
    var lbl='<span class="n">'+row.label+'</span><span class="t">'+(row.medio?'Medio año':'Año')+'</span>';
    var countBadge=yearColl?'<span class="yrh-count">'+totalMaterias+' materias</span>':'';
    // una sola fila por año
    html+='<div class="yrow'+(hasAnu?' yrow-has-anu':'')+(yearColl?' year-collapsed':'')+'">';
    html+='<div class="yrh'+(row.medio?' yrh-medio':'')+'" data-toggle-year="'+a+'" title="Click para '+(yearColl?'expandir':'colapsar')+'">'+lbl+countBadge+'</div>';
    html+='<div class="ybody" style="--ycols:'+cols+'">';
    if(hasAnu){
      html+='<div class="cell annual-cell" data-anio="'+a+'" data-anual="1"><div class="annual-tag">Anuales</div>';
      anuales.forEach(function(m){html+=cardHTML(m,red);});
      html+='</div>';
    }
    for(var p=1;p<=row.cols;p++){
      var cel=materias.filter(function(m){return m.anio===a&&!m.anual&&m.periodo===p;}).sort(byNombre);
      var cColl=collapsedCols.indexOf(p)>=0;
      html+='<div class="cell'+(cColl?' cell-col-collapsed':'')+'" data-anio="'+a+'" data-periodo="'+p+'" data-anual="0" data-mobile-lbl="'+P.label+' '+p+'">';
      cel.forEach(function(m){html+=cardHTML(m,red);});
      html+='</div>';
    }
    // relleno para medio año
    for(var q=row.cols+1;q<=cols;q++)html+='<div class="cell cell-off"></div>';
    html+='</div></div>';
  });
  board.innerHTML=html;
  // aplicar filtro de estado: dim cards que no matcheen
  if(filtroEstado){
    Array.prototype.forEach.call(board.querySelectorAll('.card'),function(card){
      var m=byId(card.getAttribute('data-id'));if(!m)return;
      if(estado(m)!==filtroEstado)card.classList.add('filter-off');
    });
  }
  bindCards();
  renderLista();
}
function byNombre(x,y){return x.nombre.localeCompare(y.nombre,'es');}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

function cardHTML(m,red){
  var est=estado(m);
  var inRed=red&&red.set[m.id];
  var dim=red&&!inRed?' dim':'';
  var net=red&&inRed?(red.ap?' net-ok':' net-no'):'';
  var selc=seleccionada===m.id?' sel':'';
  var P=PERIODS[config.tipoPeriodo];
  var tags='';
  if(m.tipo==='optativa')tags+='<span class="tag tag-opt">OPT</span>';
  if(m.equivalencia)tags+='<span class="tag tag-equiv">EQUIV</span>';
  var prof=m.profesor?'<div class="c-line"><span class="c-ic">👤</span>'+esc(m.profesor)+'</div>':'';
  var fecha=m.fecha?'<div class="c-line"><span class="c-ic">🗓</span>'+esc(fmtFecha(m.fecha))+'</div>':'';
  var corr=m.correlativas.map(function(c){var x=byId(c);return x?x.nombre:null;}).filter(Boolean);
  var corrLine=corr.length?'<div class="c-line c-corr"><span class="c-ic">⛓</span>'+esc(corr.join(', '))+'</div>':'';
  // vencimiento de regularidad
  var vence='';
  if(est==='regularizada'&&m.regVence){
    var venc=venceInfo(m.regVence);
    vence='<div class="c-line c-venc'+(venc.vencida?' c-venc-bad':'')+'"><span class="c-ic">⏳</span>Reg. vence '+esc(fmtFecha(m.regVence))+(venc.vencida?' (vencida)':'')+'</div>';
  }
  // selector de estado
  var disabledOpt=function(v){ // aprobada se bloquea si faltan correlativas
    if(v==='aprobada'){return m.correlativas.some(function(c){var x=byId(c);return x&&!esAprobada(x);})?' disabled':'';}
    return '';
  };
  var sel='<select class="estado-sel st-'+est+'" data-act="estado" data-stop="1">';
  ESTADOS.forEach(function(v){sel+='<option value="'+v+'"'+(m.estado===v?' selected':'')+disabledOpt(v)+'>'+ESTADO_LABEL[v]+'</option>';});
  sel+='</select>';
  var nf=notaFinal(m);
  var notaBox=esAprobada(m)?'<div class="nota-final" title="Nota final (se edita desde el modal)"><span class="nf-lbl">Nota final</span><span class="nf-val">'+(nf!=null?nf:'—')+'</span></div>':'';
  var foot='';
  if(m.promocionable)foot+='<span class="mini mini-pro">Promocionable</span>';
  if(m.regularizable)foot+='<span class="mini mini-reg">Regularizable</span>';
  foot+='<span class="mini mini-w">×'+m.peso+'</span>';
  return '<article class="card s-'+est+selc+dim+net+'" draggable="true" data-id="'+m.id+'">'+
    '<div class="c-top"><h3>'+esc(m.nombre)+'</h3><div class="c-tags">'+tags+
      '<button class="c-menu-btn" data-act="menu" title="Acciones">⋯</button></div></div>'+
    prof+fecha+corrLine+vence+
    '<div class="c-mid" data-print-estado="'+esc(ESTADO_LABEL[est]||'')+'">'+sel+notaBox+'</div>'+
    '<div class="c-foot">'+foot+'</div></article>';
}
function fmtFecha(iso){if(!iso)return'';var p=String(iso).split('-');if(p.length===3)return p[2]+'/'+p[1]+'/'+p[0];return iso;}
function venceInfo(iso){var hoy=new Date();hoy.setHours(0,0,0,0);var d=new Date(iso+'T00:00:00');return{vencida:d<hoy};}

function bindCards(){
  var cards=document.querySelectorAll('.card');
  Array.prototype.forEach.call(cards,function(card){
    var id=card.getAttribute('data-id');
    card.addEventListener('click',function(e){
      if(e.target.closest('[data-stop]')||e.target.getAttribute('data-act'))return;
      seleccionada=(seleccionada===id)?null:id;render();
    });
    var es=card.querySelector('[data-act="estado"]');
    if(es){es.addEventListener('click',function(e){e.stopPropagation();});es.addEventListener('change',function(e){e.stopPropagation();setEstado(byId(id),e.target.value);});}
    var mb=card.querySelector('[data-act="menu"]');
    if(mb)mb.addEventListener('click',function(e){e.stopPropagation();openCardMenu(byId(id),mb);});
    // drag & drop
    card.addEventListener('dragstart',function(e){dragId=id;card.classList.add('dragging');e.dataTransfer.effectAllowed='move';});
    card.addEventListener('dragend',function(){dragId=null;card.classList.remove('dragging');Array.prototype.forEach.call(document.querySelectorAll('.cell.drop'),function(c){c.classList.remove('drop');});});
  });
  // celdas como drop targets
  Array.prototype.forEach.call(document.querySelectorAll('.cell[data-anio]'),function(cell){
    cell.addEventListener('dragover',function(e){if(dragId){e.preventDefault();cell.classList.add('drop');}});
    cell.addEventListener('dragleave',function(){cell.classList.remove('drop');});
    cell.addEventListener('drop',function(e){
      e.preventDefault();cell.classList.remove('drop');
      if(!dragId)return;
      var m=byId(dragId);if(!m)return;
      var na=parseInt(cell.getAttribute('data-anio'),10);
      var anual=cell.getAttribute('data-anual')==='1';
      m.anio=na;
      if(anual){m.anual=true;}
      else{m.anual=false;m.periodo=parseInt(cell.getAttribute('data-periodo'),10);}
      save();render();
    });
  });
  // bindings de toggles de colapso (años y columnas)
  Array.prototype.forEach.call(document.querySelectorAll('[data-toggle-year]'),function(btn){
    btn.addEventListener('click',function(e){e.stopPropagation();toggleYearCollapse(parseInt(btn.getAttribute('data-toggle-year'),10));});
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-toggle-col]'),function(btn){
    btn.addEventListener('click',function(e){if(isMobile())return;e.stopPropagation();toggleColCollapse(parseInt(btn.getAttribute('data-toggle-col'),10));});
  });
}

function openCardMenu(m,btn){
  closeCardMenu();
  var ICO_EDIT='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
  var ICO_DUP='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  var ICO_DEL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>';
  var html='<div class="cmenu" id="cmenu">'+
    '<button data-cm="edit">'+ICO_EDIT+'Editar materia</button>'+
    '<button data-cm="dup">'+ICO_DUP+'Duplicar</button>'+
    '<div class="cm-sep"></div>'+
    '<button data-cm="del" class="cm-del">'+ICO_DEL+'Eliminar</button></div>';
  var root=document.getElementById('menuRoot');root.innerHTML=html;
  var menu=document.getElementById('cmenu');
  var r=btn.getBoundingClientRect();
  var mw=menu.offsetWidth,mh=menu.offsetHeight;
  // alineado al borde derecho del botón, justo debajo; flip si no entra
  var x=r.right-mw; if(x<8)x=r.left;
  x=Math.max(8,Math.min(x,window.innerWidth-mw-8));
  var y=r.bottom+4;
  if(y+mh>window.innerHeight-8)y=r.top-mh-4;
  menu.style.left=x+'px';menu.style.top=y+'px';
  menu.querySelector('[data-cm="edit"]').onclick=function(){closeCardMenu();openModal(m);};
  menu.querySelector('[data-cm="dup"]').onclick=function(){closeCardMenu();duplicar(m);};
  menu.querySelector('[data-cm="del"]').onclick=function(){closeCardMenu();confirmar('Eliminar materia','¿Eliminar "'+m.nombre+'"? Esta acción se puede deshacer.',function(){eliminar(m.id);});};
  setTimeout(function(){document.addEventListener('click',closeCardMenu,{once:true});},0);
}
function closeCardMenu(){var r=document.getElementById('menuRoot');if(r)r.innerHTML='';}

/* ─── lista lateral ─── */
function renderLista(){
  var arr=materias.slice().sort(function(a,b){return a.anio-b.anio||(a.anual?-1:0)-(b.anual?-1:0)||a.periodo-b.periodo||byNombre(a,b);});
  if(filtro)arr=arr.filter(function(m){return m.nombre.toLowerCase().indexOf(filtro.toLowerCase())>=0;});
  document.getElementById('listCnt').textContent=materias.length;
  var html='';
  arr.forEach(function(m){
    var est=estado(m);
    var fl='';
    if(m.anual)fl+='<i class="fl-anu" title="Anual">A</i>';
    if(m.tipo==='optativa')fl+='<i class="fl-opt" title="Optativa">O</i>';
    if(m.promocionable)fl+='<i class="fl-pro" title="Promocionable">P</i>';
    if(m.regularizable)fl+='<i class="fl-reg" title="Regularizable">R</i>';
    if(esAprobada(m))fl+='<i class="fl-ap" title="Aprobada">✓</i>';
    html+='<button class="li'+(seleccionada===m.id?' sel':'')+'" data-id="'+m.id+'"><span class="dot dot-'+est+'"></span><span class="nm">'+esc(m.nombre)+'</span><span class="fl">'+fl+'</span></button>';
  });
  var ls=document.getElementById('listaScroll');
  ls.innerHTML=html||'<div class="muted">Sin materias.</div>';
  Array.prototype.forEach.call(ls.querySelectorAll('.li'),function(b){
    b.addEventListener('click',function(){openModal(byId(b.getAttribute('data-id')));});
  });
}

/* ─── modal materia ─── */
function openModal(mat){
  closeCardMenu();
  var nuevo=!mat;
  var f=mat?Object.assign({},mat,{correlativas:mat.correlativas.slice(),notas:(mat.notas||[]).slice()}):{id:null,nombre:'',anio:1,periodo:1,anual:false,tipo:'obligatoria',peso:1,promocionable:false,regularizable:false,estado:'pendiente',notas:[],regVence:'',equivalencia:false,profesor:'',fecha:'',obs:'',correlativas:[]};
  var P=PERIODS[config.tipoPeriodo],cols=P.cols;
  function opts(n,sel){var o='';for(var i=1;i<=n;i++)o+='<option value="'+i+'"'+(sel===i?' selected':'')+'>'+i+'°</option>';if(config.medioAnio){o+='<option value="'+(n+1)+'"'+(sel===n+1?' selected':'')+'>½ (medio año)</option>';}return o;}
  var corrCand=materias.filter(function(m){return m.id!==f.id;}).sort(function(a,b){return a.anio-b.anio||a.periodo-b.periodo||byNombre(a,b);});
  var corrHTML='';
  if(corrCand.length){
    var lastY=null;
    corrCand.forEach(function(m){
      if(m.anio!==lastY){corrHTML+='<div class="corr-grouphd">'+m.anio+'° Año</div>';lastY=m.anio;}
      var on=f.correlativas.indexOf(m.id)>=0;
      var sub=m.anual?'':P.label+' '+m.periodo;
      // detectar si seleccionarla generaría ciclo (solo si estamos editando)
      var crearia=f.id?cicloSiAgrego(f.id,m.id):false;
      var disabled=crearia&&!on?' disabled title="Generaría una correlatividad circular"':'';
      corrHTML+='<label class="corr'+(on?' on':'')+(crearia&&!on?' corr-circ':'')+'"><span class="corr-info"><span class="nm">'+esc(m.nombre)+(crearia&&!on?' <small style="color:var(--no)">↻ ciclo</small>':'')+'</span>'+
        (m.anual?'<span class="corr-tag">Anual</span>':'<small>'+sub+'</small>')+
        '</span><input type="checkbox" data-corr="'+m.id+'" '+(on?'checked':'')+disabled+'></label>';
    });
  }else corrHTML='<p class="muted">No hay otras materias en el plan.</p>';

  function notasUI(notas){
    var h='<div class="notas-list" id="notas_list">';
    notas.forEach(function(n,i){
      h+='<div class="nota-row"><input type="number" min="0" max="10" step="0.01" value="'+n+'" data-nota-i="'+i+'"><button class="btn btn-light btn-sm" data-rmn="'+i+'" title="Quitar">×</button></div>';
    });
    h+='</div><button class="btn btn-light btn-sm" id="addNota">+ Agregar nota</button>';
    h+='<p class="muted" style="padding:0;margin-top:6px">La última es la nota final. Notas previas (incluidos aplazos) cuentan en "promedio con aplazos".</p>';
    return h;
  }

  var estadoOpts=ESTADOS.map(function(v){return'<option value="'+v+'"'+(f.estado===v?' selected':'')+'>'+ESTADO_LABEL[v]+'</option>';}).join('');

  var html='<div class="overlay" id="ov"><div class="modal"><div class="m-head"><h2>'+(nuevo?'Nueva materia':'Editar materia')+'</h2><button class="m-x" id="mx">×</button></div>'+
    '<div class="m-body">'+
      '<div class="field"><label>Nombre</label><input id="f_nombre" value="'+esc(f.nombre)+'" placeholder="Ej. Análisis Matemático I"><div class="err" id="err_nombre" style="display:none"></div></div>'+
      '<div class="grid2"><div class="field"><label>Profesor / Cátedra</label><input id="f_prof" value="'+esc(f.profesor)+'" placeholder="Opcional"></div>'+
        '<div class="field"><label>Fecha de cursado</label><input id="f_fecha" type="date" value="'+esc(f.fecha)+'"></div></div>'+
      '<div class="switches"><label class="sw"><input type="checkbox" id="f_anual" '+(f.anual?'checked':'')+'> Materia anual</label></div>'+
      '<div class="grid4">'+
        '<div class="field"><label>Año</label><select id="f_anio">'+opts(config.anios,f.anio)+'</select></div>'+
        '<div class="field" id="wrap_periodo"><label>'+P.label+'</label><select id="f_periodo">'+(function(){var o='';for(var i=1;i<=cols;i++)o+='<option value="'+i+'"'+(f.periodo===i?' selected':'')+'>'+i+'</option>';return o;})()+'</select></div>'+
        '<div class="field"><label>Tipo</label><select id="f_tipo"><option value="obligatoria"'+(f.tipo==='obligatoria'?' selected':'')+'>Obligatoria</option><option value="optativa"'+(f.tipo==='optativa'?' selected':'')+'>Optativa</option></select></div>'+
        '<div class="field"><label>Peso promedio</label><input id="f_peso" type="number" min="0.1" step="0.1" value="'+f.peso+'"></div>'+
      '</div>'+
      '<div class="field"><label>Aprobación</label><div class="radio-row">'+
        '<label class="radio"><input type="radio" name="f_cursada" value="ninguna" '+(!f.promocionable&&!f.regularizable?'checked':'')+'> <span>Ninguna</span></label>'+
        '<label class="radio"><input type="radio" name="f_cursada" value="promocionable" '+(f.promocionable?'checked':'')+'> <span>Promocionable</span></label>'+
        '<label class="radio"><input type="radio" name="f_cursada" value="regularizable" '+(f.regularizable?'checked':'')+'> <span>Regularizable</span></label>'+
      '</div></div>'+
      '<div class="grid2">'+
        '<div class="field"><label>Estado</label><select id="f_estado">'+estadoOpts+'</select></div>'+
        '<div class="field" id="wrap_venc"><label>Vence regularidad</label><input id="f_venc" type="date" value="'+esc(f.regVence||'')+'"></div>'+
      '</div>'+
      '<div class="field" id="wrap_equiv"><label class="sw"><input type="checkbox" id="f_equiv" '+(f.equivalencia?'checked':'')+'> <span>Aprobada por equivalencia</span></label><small class="hint">Si no le ponés nota, no cuenta en el promedio.</small></div>'+
      '<div class="field" id="wrap_notas"><label>Notas (en orden cronológico)</label>'+notasUI(f.notas)+'</div>'+
      '<div class="field"><label>Notas / observaciones</label><textarea id="f_obs" placeholder="Texto libre del estudiante…">'+esc(f.obs)+'</textarea></div>'+
      '<div class="field"><label>Correlativas</label><div class="corrbox" id="corrbox">'+corrHTML+'</div></div>'+
    '</div>'+
    '<div class="m-foot"><div class="l"></div>'+
      '<div class="r"><button class="btn btn-light" id="mCancel">Cancelar</button><button class="btn btn-pri" id="mSave">Guardar</button></div></div>'+
    '</div></div>';
  document.getElementById('modalRoot').innerHTML=html;

  var ov=document.getElementById('ov');
  function close(){document.getElementById('modalRoot').innerHTML='';document.removeEventListener('keydown',esckey);}
  function esckey(e){if(e.key==='Escape')close();}
  document.addEventListener('keydown',esckey);
  ov.addEventListener('mousedown',function(e){if(e.target===ov)close();});
  document.getElementById('mx').onclick=close;
  document.getElementById('mCancel').onclick=close;

  // anual deshabilita período
  var anualCB=document.getElementById('f_anual');
  function syncAnual(){document.getElementById('wrap_periodo').style.opacity=anualCB.checked?'.4':'1';document.getElementById('f_periodo').disabled=anualCB.checked;}
  anualCB.addEventListener('change',syncAnual);syncAnual();
  // tipo -> peso default
  document.getElementById('f_tipo').addEventListener('change',function(e){document.getElementById('f_peso').value=e.target.value==='optativa'?0.5:1;});
  // estado -> mostrar/ocultar vencimiento + habilitar equivalencia
  var estSel=document.getElementById('f_estado'),wrapVenc=document.getElementById('wrap_venc'),equivCB=document.getElementById('f_equiv'),wrapEquiv=document.getElementById('wrap_equiv');
  function syncEstado(){
    wrapVenc.style.display=estSel.value==='regularizada'?'':'none';
    var ap=estSel.value==='aprobada';
    wrapEquiv.style.opacity=ap?'1':'.4';
    equivCB.disabled=!ap;
    if(!ap)equivCB.checked=false;
  }
  estSel.addEventListener('change',syncEstado);syncEstado();
  // notas locales (se sincronizan al guardar)
  var notasLocal=f.notas.slice();
  function repintarNotas(){document.getElementById('wrap_notas').innerHTML='<label>Notas (en orden cronológico)</label>'+notasUI(notasLocal);bindNotas();}
  function bindNotas(){
    var addBtn=document.getElementById('addNota');
    if(addBtn)addBtn.onclick=function(){notasLocal.push(7);repintarNotas();};
    Array.prototype.forEach.call(document.querySelectorAll('[data-nota-i]'),function(inp){
      inp.addEventListener('input',function(){var i=+inp.getAttribute('data-nota-i');var n=parseFloat(String(inp.value).replace(',','.'));if(!isNaN(n))notasLocal[i]=Math.max(0,Math.min(10,n));});
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-rmn]'),function(btn){
      btn.onclick=function(){var i=+btn.getAttribute('data-rmn');notasLocal.splice(i,1);repintarNotas();};
    });
  }
  bindNotas();
  // correlativas highlight
  Array.prototype.forEach.call(document.querySelectorAll('#corrbox input'),function(inp){
    inp.addEventListener('change',function(){inp.closest('.corr').classList.toggle('on',inp.checked);});
  });

  document.getElementById('mSave').onclick=function(){
    var nombre=document.getElementById('f_nombre').value.trim();
    var errEl=document.getElementById('err_nombre');
    errEl.style.display='none';
    if(!nombre){errEl.textContent='El nombre es obligatorio.';errEl.style.display='block';return;}
    if(nombreDuplicado(nombre,f.id)){errEl.textContent='Ya existe una materia con ese nombre.';errEl.style.display='block';return;}
    var anual=anualCB.checked;
    var estadoSel=document.getElementById('f_estado').value;
    var corr=[];Array.prototype.forEach.call(document.querySelectorAll('#corrbox input:checked'),function(i){corr.push(i.getAttribute('data-corr'));});
    // si está aprobada, validar correlativas aprobadas
    if(estadoSel==='aprobada'){
      var faltan=corr.map(byId).filter(function(c){return c&&!esAprobada(c);});
      if(faltan.length){errEl.textContent='No puede marcarse como aprobada: faltan correlativas → '+faltan.map(function(x){return x.nombre;}).join(', ');errEl.style.display='block';return;}
    }
    var data={
      id:f.id||uid(),nombre:nombre,
      anio:parseInt(document.getElementById('f_anio').value,10),
      periodo:anual?1:parseInt(document.getElementById('f_periodo').value,10),
      anual:anual,
      tipo:document.getElementById('f_tipo').value,
      peso:Math.max(0.1,parseFloat(document.getElementById('f_peso').value)||0.1),
      promocionable:(document.querySelector('input[name="f_cursada"]:checked')||{}).value==='promocionable',
      regularizable:(document.querySelector('input[name="f_cursada"]:checked')||{}).value==='regularizable',
      estado:estadoSel,
      notas:notasLocal.slice(),
      regVence:estadoSel==='regularizada'?document.getElementById('f_venc').value:'',
      equivalencia:estadoSel==='aprobada'&&document.getElementById('f_equiv').checked,
      profesor:document.getElementById('f_prof').value.trim(),
      fecha:document.getElementById('f_fecha').value,
      obs:document.getElementById('f_obs').value.trim(),
      correlativas:corr
    };
    // si pasa a aprobada y no hay nota, default 7 (excepto si es por equivalencia: en ese caso respetar sin nota)
    if(data.estado==='aprobada'&&!data.notas.length&&!data.equivalencia)data.notas=[7];
    if(f.id&&byId(f.id)){materias=materias.map(function(m){return m.id===f.id?data:m;});}
    else{materias.push(data);}
    save();close();render();
  };
}

/* ─── modal de novedades por versión ─── */
function openWhatsNew(versionesAMostrar,modoHistorial){
  closeCardMenu();
  var bloques=versionesAMostrar.map(function(item){
    var lis=item.cambios.map(function(c){return'<li>'+esc(c)+'</li>';}).join('');
    return'<div class="wn-block"><div class="wn-head"><span class="wn-ver">v'+esc(item.v)+'</span><span class="wn-title">'+esc(item.titulo)+'</span><span class="wn-date">'+esc(item.fecha)+'</span></div><ul class="wn-list">'+lis+'</ul></div>';
  }).join('');
  var titulo=modoHistorial?'Historial de versiones':'¿Qué hay de nuevo?';
  var intro=modoHistorial
    ?'<p class="wn-intro">Estas son todas las versiones publicadas de la app, ordenadas de la más reciente a la más antigua.</p>'
    :'<p class="wn-intro">Actualizamos la app desde la última vez que la usaste. Estos son los cambios:</p>';
  var safe=modoHistorial?'':'<p class="wn-safe">Tus datos (materias, notas, configuración) no fueron modificados.</p>';
  var html='<div class="overlay" id="ovWN"><div class="modal" style="max-width:520px"><div class="m-head"><h2>'+titulo+'</h2><button class="m-x" id="wnX">×</button></div>'+
    '<div class="m-body">'+intro+bloques+safe+'</div>'+
    '<div class="m-foot"><div class="l"></div><div class="r"><button class="btn btn-pri" id="wnOk">'+(modoHistorial?'Cerrar':'Entendido')+'</button></div></div>'+
    '</div></div>';
  document.getElementById('modalRoot').innerHTML=html;
  var ov=document.getElementById('ovWN');
  function close(){
    document.getElementById('modalRoot').innerHTML='';
    document.removeEventListener('keydown',ek);
    if(!modoHistorial)store.set('pe2_lastSeenVersion',APP_VERSION);
  }
  function ek(e){if(e.key==='Escape'||e.key==='Enter')close();}
  document.addEventListener('keydown',ek);
  ov.addEventListener('mousedown',function(e){if(e.target===ov)close();});
  document.getElementById('wnX').onclick=close;
  document.getElementById('wnOk').onclick=close;
  setTimeout(function(){document.getElementById('wnOk').focus();},10);
}

/* ─── modal: generar con IA ─── */
function openAIPrompt(){
  closeCardMenu();
  var prompt = [
    'Necesito que generes un archivo JSON con mi plan de estudios universitario, en el formato exacto que se describe abajo, para importarlo en una app de gestión de cursada.',
    '',
    'INSTRUCCIONES:',
    '1. Te voy a describir mi carrera, materias, años y estado de cada una.',
    '2. Vas a devolver UN SOLO bloque de JSON válido, sin texto adicional antes ni después.',
    '3. No uses comentarios dentro del JSON.',
    '4. Respetá EXACTAMENTE los nombres de campos y los valores permitidos.',
    '',
    'FORMATO DEL JSON:',
    '{',
    '  "appVersion": "1.1.0",',
    '  "dataVersion": 3,',
    '  "config": {',
    '    "carrera": "Nombre de la carrera",',
    '    "estudiante": "",',
    '    "facultad": "",',
    '    "universidad": "",',
    '    "ingreso": "",',
    '    "egreso": "",',
    '    "anios": 5,',
    '    "medioAnio": false,',
    '    "tipoPeriodo": "cuatrimestre"',
    '  },',
    '  "materias": [',
    '    {',
    '      "id": "id-unico-1",',
    '      "nombre": "Nombre de la materia",',
    '      "anio": 1,',
    '      "periodo": 1,',
    '      "anual": false,',
    '      "tipo": "obligatoria",',
    '      "peso": 1,',
    '      "promocionable": true,',
    '      "regularizable": false,',
    '      "estado": "pendiente",',
    '      "notas": [],',
    '      "regVence": "",',
    '      "equivalencia": false,',
    '      "profesor": "",',
    '      "fecha": "",',
    '      "obs": "",',
    '      "correlativas": []',
    '    }',
    '  ]',
    '}',
    '',
    'REGLAS DE LOS CAMPOS:',
    '- tipoPeriodo: solo "bimestre" (6 columnas/año), "trimestre" (3), "semestre" (2) o "cuatrimestre" (2).',
    '- anios: cantidad de años de la carrera (1 a 10).',
    '- medioAnio: true si la carrera dura X años y medio (ej. 5.5).',
    '- anual: true si la materia es anual (ocupa todo el año, no un período).',
    '- tipo: "obligatoria" u "optativa".',
    '- peso: 1 para obligatorias y 0.5 para optativas (o el peso real que aporten al promedio).',
    '- promocionable y regularizable son MUTUAMENTE EXCLUYENTES (solo uno puede ser true, o ambos false).',
    '- estado: "pendiente", "en_curso", "regularizada" o "aprobada".',
    '- notas: array de números (ej. [7, 8.5]). La última es la nota final. Vacío si no hay notas.',
    '- regVence: fecha de vencimiento de regularidad en formato "AAAA-MM-DD". Vacío si no aplica.',
    '- equivalencia: true SOLO si la materia está aprobada por equivalencia. Si tiene equivalencia y no tiene nota, no cuenta en el promedio.',
    '- correlativas: array con los "id" de las materias que son requisito previo. Si no tenés las correlatividades, dejalo vacío [].',
    '- id: cada materia debe tener un id único (string corto, ej. "m01", "m02", "alg1").',
    '',
    'AHORA TE PASO MI INFORMACIÓN:',
    '',
    '[ACÁ PEGÁ TU PLAN DE ESTUDIOS COMPLETO: carrera, duración, lista de materias por año y período, cuáles aprobaste, notas, equivalencias, materias no promocionables, etc. Cuanto más detalle, mejor.]',
    '',
    'IMPORTANTE: devolveme SOLO el JSON, sin explicaciones ni texto adicional. Que sea válido y se pueda importar directamente.'
  ].join('\n');

  var html='<div class="overlay" id="ovAI"><div class="modal" style="max-width:640px"><div class="m-head"><h2>Generar plan con IA</h2><button class="m-x" id="aiX">×</button></div>'+
    '<div class="m-body">'+
      '<p class="ai-intro">Si tenés el plan de tu carrera y querés cargar todas las materias de una sola vez, podés usar una IA (ChatGPT, Claude, Gemini, etc.) para que te genere el archivo JSON automáticamente.</p>'+
      '<div class="ai-steps">'+
        '<div class="ai-step"><span class="ai-num">1</span><div><b>Copiá el prompt</b><small>Click en el botón de abajo.</small></div></div>'+
        '<div class="ai-step"><span class="ai-num">2</span><div><b>Pegalo en una IA</b><small>Junto con la lista completa de tu plan: materias, años, períodos, notas, equivalencias.</small></div></div>'+
        '<div class="ai-step"><span class="ai-num">3</span><div><b>Guardá el JSON</b><small>Copiá la respuesta, pegala en un archivo de texto y guardalo como <code>.json</code>.</small></div></div>'+
        '<div class="ai-step"><span class="ai-num">4</span><div><b>Importalo</b><small>Volvé acá y usá el botón <i>Importar</i>.</small></div></div>'+
      '</div>'+
      '<textarea class="ai-prompt" id="aiPromptText" readonly>'+esc(prompt)+'</textarea>'+
      '<p class="ai-warn">⚠ Siempre revisá el JSON antes de importarlo. Las IA pueden equivocarse con nombres de materias o estructura. Importar reemplaza tu plan actual.</p>'+
    '</div>'+
    '<div class="m-foot"><div class="l"></div><div class="r"><button class="btn btn-light" id="aiClose">Cerrar</button><button class="btn btn-pri" id="aiCopy">Copiar prompt</button></div></div>'+
    '</div></div>';
  document.getElementById('modalRoot').innerHTML=html;
  var ov=document.getElementById('ovAI');
  function close(){document.getElementById('modalRoot').innerHTML='';document.removeEventListener('keydown',ek);}
  function ek(e){if(e.key==='Escape')close();}
  document.addEventListener('keydown',ek);
  ov.addEventListener('mousedown',function(e){if(e.target===ov)close();});
  document.getElementById('aiX').onclick=close;
  document.getElementById('aiClose').onclick=close;
  document.getElementById('aiCopy').onclick=function(){
    var ta=document.getElementById('aiPromptText');
    ta.select();ta.setSelectionRange(0,99999);
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText){
        navigator.clipboard.writeText(ta.value).then(function(){toast('Prompt copiado al portapapeles');},function(){document.execCommand('copy');toast('Prompt copiado al portapapeles');});
      }else{
        document.execCommand('copy');toast('Prompt copiado al portapapeles');
      }
    }catch(e){toast('No se pudo copiar automáticamente. Seleccioná el texto manualmente.');}
  };
}

/* ─── modal: bienvenida / guía ─── */
function openWelcome(){
  closeCardMenu();
  var html='<div class="overlay" id="ovW"><div class="modal" style="max-width:580px"><div class="m-head"><h2>¿Cómo empezar?</h2><button class="m-x" id="wX">×</button></div>'+
    '<div class="m-body">'+
      '<p class="ai-intro">Guía rápida para sacarle el máximo provecho a la app. Podés volver a verla en cualquier momento desde el enlace <b>Ayuda</b> del pie de página.</p>'+
      '<div class="ai-steps welcome-steps">'+
        '<div class="welcome-section">Primeros pasos</div>'+
        '<div class="ai-step"><span class="ai-num">1</span><div><b>Configurá tu carrera</b><small>Abrí <b>Configuración</b> en el panel lateral y cargá nombre de la carrera, estudiante, facultad, universidad, año de ingreso/egreso, cantidad de años y el tipo de período (bimestre, cuatrimestre, etc.).</small></div></div>'+
        '<div class="ai-step"><span class="ai-num">2</span><div><b>Agregá tus materias</b><small>Click en <b>+ Agregar materia</b>. Cada una se ubica por año y período. Marcá si es <b>obligatoria</b> u <b>optativa</b>, su peso para el promedio, si es <b>anual</b>, y si tiene profesor o fecha de cursado.</small></div></div>'+
        '<div class="ai-step"><span class="ai-num">3</span><div><b>Cargá las correlatividades</b><small>Al editar una materia, en la sección <b>Correlativas</b> marcá las que son requisito previo. La app te bloqueará intentos de aprobar si faltan correlativas, y te avisará si querés desaprobar una materia requisito de otras aprobadas.</small></div></div>'+

        '<div class="welcome-section">Día a día</div>'+
        '<div class="ai-step"><span class="ai-num">4</span><div><b>Cambiá el estado desde la tarjeta</b><small>Sin abrir el modal, podés cambiar el estado de una materia (Pendiente, En curso, Regularizada, Aprobada) desde el selector que aparece en la tarjeta misma.</small></div></div>'+
        '<div class="ai-step"><span class="ai-num">5</span><div><b>Cargá tus notas</b><small>Una materia puede tener varias notas (por ejemplo, si la cursaste y desaprobaste el final). La última cargada es la <b>nota final</b> y se muestra en la tarjeta. Se calculan dos promedios: con y sin aplazos.</small></div></div>'+
        '<div class="ai-step"><span class="ai-num">6</span><div><b>Marcá equivalencias</b><small>Si una materia te la aprobaron por equivalencia, marcala como tal en el modal de edición. Si no le ponés nota, no afecta el promedio.</small></div></div>'+
        '<div class="ai-step"><span class="ai-num">7</span><div><b>Vencimiento de regularidad</b><small>Cuando una materia está <b>Regularizada</b> podés cargar la fecha hasta la que tenés tiempo de rendir el final. Si esa fecha pasa, la tarjeta se marca automáticamente como <b>Libre</b> (en rojo).</small></div></div>'+

        '<div class="welcome-section">Visualización</div>'+
        '<div class="ai-step"><span class="ai-num">8</span><div><b>Mirá la red de correlativas</b><small>Click sobre cualquier tarjeta y se resaltan todas las materias relacionadas: las que son requisito y las que dependen de ella. Verde si está aprobada, rojo si todavía no.</small></div></div>'+
        '<div class="ai-step"><span class="ai-num">9</span><div><b>Colapsá filas y columnas</b><small>Click sobre el encabezado de un año (ej. <b>1°</b>) o de un período (ej. <b>Bimestre 1</b>) para colapsarlo cuando no querés verlo. El estado se guarda entre sesiones.</small></div></div>'+
        '<div class="ai-step"><span class="ai-num">10</span><div><b>Filtrá por estado</b><small>En la barra superior tenés un selector para mostrar solo materias aprobadas, libres, en curso, etc. Útil para visualizar lo que falta.</small></div></div>'+
        '<div class="ai-step"><span class="ai-num">11</span><div><b>Arrastrá para reubicar</b><small>Podés tomar una tarjeta y soltarla en otra celda para cambiarle el año o el período sin abrir el modal.</small></div></div>'+

        '<div class="welcome-section">Cuidá tu progreso</div>'+
        '<div class="ai-step ai-step-warn"><span class="ai-num">!</span><div><b>Exportá tus datos cada tanto</b><small>La app guarda todo en tu navegador, pero si lo cambiás, lo formateás o limpiás cookies, perdés el avance. Andá a <b>Configuración → Exportar JSON</b> y guardá el archivo. La app te recordará hacerlo cada 7 días.</small></div></div>'+
        '<div class="ai-step"><span class="ai-num">12</span><div><b>Importá tu plan en otro dispositivo</b><small>Para usar la app en otra compu o celular, exportá el JSON de un lado e importalo del otro desde <b>Configuración → Importar JSON</b>. Reemplaza el plan actual.</small></div></div>'+
        '<div class="ai-step"><span class="ai-num">13</span><div><b>Recuperá una eliminación</b><small>Si borrás una materia por error, podés deshacerla con <b>Ctrl+Z</b> o con el botón "Deshacer" del aviso que aparece abajo.</small></div></div>'+

        '<div class="welcome-section">Atajos</div>'+
        '<div class="ai-step"><span class="ai-num">★</span><div><b>Generador con IA</b><small>¿Tenés el plan completo a mano? Usá <b>Generar con IA</b> para obtener un prompt listo para pegar en ChatGPT, Claude o Gemini junto con tu plan, recibir el JSON, y importarlo. Te ahorra cargar materia por materia.</small></div></div>'+
        '<div class="ai-step"><span class="ai-num">★</span><div><b>Exportar a PDF</b><small>Desde el botón <b>PDF</b> podés generar una versión imprimible o guardarla como PDF en A4 (horizontal o vertical).</small></div></div>'+
      '</div>'+
    '</div>'+
    '<div class="m-foot"><div class="l"></div><div class="r"><button class="btn btn-pri" id="wOk">Entendido</button></div></div>'+
    '</div></div>';
  document.getElementById('modalRoot').innerHTML=html;
  var ov=document.getElementById('ovW');
  function close(){
    document.getElementById('modalRoot').innerHTML='';
    document.removeEventListener('keydown',ek);
    store.set('pe2_welcomeSeen',1);
  }
  function ek(e){if(e.key==='Escape'||e.key==='Enter')close();}
  document.addEventListener('keydown',ek);
  ov.addEventListener('mousedown',function(e){if(e.target===ov)close();});
  document.getElementById('wX').onclick=close;
  document.getElementById('wOk').onclick=close;
  setTimeout(function(){var ok=document.getElementById('wOk');if(ok)ok.focus();},10);
}

/* ─── modal acerca de ─── */
function openAbout(){
  closeCardMenu();
  var REPO='https://github.com/Lautaro-Benitez/Plan_de_Estudios_Interactivo';
  var html='<div class="overlay" id="ovA"><div class="modal" style="max-width:480px"><div class="m-head"><h2>Acerca de</h2><button class="m-x" id="aX">×</button></div>'+
    '<div class="m-body">'+
      '<div class="about-hero">'+
        '<h3>Plan de Estudios Interactivo</h3>'+
        '<p class="about-ver">Versión '+esc(APP_VERSION)+'</p>'+
      '</div>'+
      '<p class="about-desc">Aplicación web autónoma para gestionar el plan de estudios de una carrera universitaria: materias, correlatividades, estados de cursada, notas, promedio ponderado y progreso de carrera. Funciona 100% offline y guarda los datos localmente en tu navegador.</p>'+
      '<div class="about-links">'+
        '<a class="about-link" href="'+REPO+'#readme" target="_blank" rel="noopener">'+
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'+
          '<span><b>Documentación</b><small>README en GitHub</small></span>'+
          '<svg class="about-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>'+
        '</a>'+
        '<a class="about-link" href="'+REPO+'/blob/main/LICENSE" target="_blank" rel="noopener">'+
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'+
          '<span><b>Licencia</b><small>MIT License</small></span>'+
          '<svg class="about-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>'+
        '</a>'+
        '<button class="about-link about-link-btn" id="aboutChangelog" type="button">'+
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'+
          '<span><b>Historial de versiones</b><small>Todos los cambios de la app</small></span>'+
          '<svg class="about-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>'+
        '</button>'+
      '</div>'+
      '<p class="about-credit">Desarrollado por <b>Lautaro Benitez</b><br>2026</p>'+
    '</div></div></div>';
  document.getElementById('modalRoot').innerHTML=html;
  var ov=document.getElementById('ovA');
  function close(){document.getElementById('modalRoot').innerHTML='';document.removeEventListener('keydown',ek);}
  function ek(e){if(e.key==='Escape')close();}
  document.addEventListener('keydown',ek);
  ov.addEventListener('mousedown',function(e){if(e.target===ov)close();});
  document.getElementById('aX').onclick=close;
  document.getElementById('aboutChangelog').onclick=function(e){
    e.preventDefault();
    close();
    setTimeout(function(){openWhatsNew(CHANGES_BY_VERSION,true);},80);
  };
}

/* ─── modal configuración ─── */
function openConfig(){
  closeCardMenu();
  var c=config;
  function inp(id,val,ph){return'<input id="'+id+'" value="'+esc(val||'')+'" placeholder="'+(ph||'')+'">';}
  var perOpts=Object.keys(PERIODS).map(function(k){return'<option value="'+k+'"'+(c.tipoPeriodo===k?' selected':'')+'>'+PERIODS[k].label+'</option>';}).join('');
  var html='<div class="overlay" id="ovc"><div class="modal wide"><div class="m-head"><h2>Configuración</h2><button class="m-x" id="cx">×</button></div>'+
    '<div class="m-body">'+
      '<div class="field"><label>Nombre de la carrera</label>'+inp('c_carrera',c.carrera,'Ej. Ingeniería en Sistemas')+'</div>'+
      '<div class="field"><label>Nombre del estudiante</label>'+inp('c_est',c.estudiante,'Tu nombre')+'</div>'+
      '<div class="grid2"><div class="field"><label>Facultad</label>'+inp('c_fac',c.facultad,'Ej. Facultad de Ingeniería')+'</div>'+
        '<div class="field"><label>Universidad</label>'+inp('c_uni',c.universidad,'Ej. UBA')+'</div></div>'+
      '<div class="grid4">'+
        '<div class="field"><label>Año ingreso</label><input id="c_ing" type="number" value="'+esc(c.ingreso||'')+'" placeholder="2022"></div>'+
        '<div class="field"><label>Año egreso</label><input id="c_egr" type="number" value="'+esc(c.egreso||'')+'" placeholder="2027"></div>'+
        '<div class="field"><label>Cantidad de años</label><input id="c_anios" type="number" min="1" max="10" value="'+c.anios+'"></div>'+
        '<div class="field"><label>Tipo de período</label><select id="c_per">'+perOpts+'</select></div>'+
      '</div>'+
      '<div class="switches"><label class="sw"><input type="checkbox" id="c_medio" '+(c.medioAnio?'checked':'')+'> La carrera tiene un medio año final (ej. 5 años y medio)</label></div>'+
      '<div class="field"><label>Datos</label><div class="btn-grid"><button class="btn btn-light btn-sm" id="cExp">Exportar JSON</button><button class="btn btn-light btn-sm" id="cImp">Importar JSON</button></div></div>'+
    '</div>'+
    '<div class="m-foot"><div class="l"></div><div class="r"><button class="btn btn-light" id="cCancel">Cancelar</button><button class="btn btn-pri" id="cSave">Guardar</button></div></div>'+
    '</div></div>';
  document.getElementById('modalRoot').innerHTML=html;
  var ov=document.getElementById('ovc');
  function close(){document.getElementById('modalRoot').innerHTML='';document.removeEventListener('keydown',ek);}
  function ek(e){if(e.key==='Escape')close();}
  document.addEventListener('keydown',ek);
  ov.addEventListener('mousedown',function(e){if(e.target===ov)close();});
  document.getElementById('cx').onclick=close;document.getElementById('cCancel').onclick=close;
  document.getElementById('cExp').onclick=exportData;
  document.getElementById('cImp').onclick=function(){document.getElementById('fileInput').click();};
  document.getElementById('cSave').onclick=function(){
    var anios=Math.max(1,Math.min(10,parseInt(document.getElementById('c_anios').value,10)||1));
    var medio=document.getElementById('c_medio').checked;
    config={carrera:document.getElementById('c_carrera').value.trim(),estudiante:document.getElementById('c_est').value.trim(),
      facultad:document.getElementById('c_fac').value.trim(),universidad:document.getElementById('c_uni').value.trim(),
      ingreso:document.getElementById('c_ing').value.trim(),egreso:document.getElementById('c_egr').value.trim(),
      anios:anios,medioAnio:medio,tipoPeriodo:document.getElementById('c_per').value};
    // reubicar materias fuera de rango
    var maxAnio=medio?anios+1:anios;
    materias.forEach(function(m){if(m.anio>maxAnio)m.anio=maxAnio;var cols=PERIODS[config.tipoPeriodo].cols;if(m.periodo>cols)m.periodo=cols;});
    save();close();render();
  };
}

/* ─── import/export/pdf/limpieza ─── */
function exportData(){
  var payload={appVersion:APP_VERSION,dataVersion:DATA_VERSION,exportedAt:new Date().toISOString(),config:config,materias:materias};
  var blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  var url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=(config.carrera?config.carrera.replace(/\s+/g,'-').toLowerCase():'plan')+'.json';a.click();URL.revokeObjectURL(url);
  store.set('pe2_lastExport',Date.now());
}
function importData(e){
  var file=e.target.files&&e.target.files[0];if(!file)return;
  var r=new FileReader();
  r.onload=function(){
    try{
      var data=JSON.parse(r.result);
      var mats=Array.isArray(data)?data:data.materias;
      if(!Array.isArray(mats))throw new Error('El archivo no contiene un plan válido.');
      var dv=data.dataVersion||1;
      var aviso=dv<DATA_VERSION?' Se migrarán datos desde versión '+dv+' a '+DATA_VERSION+'.':'';
      confirmar('Importar plan','Esto reemplazará el plan actual.'+aviso+' ¿Continuar?',function(){
        materias=migrar(mats);
        var importedConfig = data.config || (!Array.isArray(data) ? data : null);
        if(importedConfig) {
          var nc = Object.assign({}, DEFAULT_CONFIG);
          for(var k in DEFAULT_CONFIG) if(importedConfig[k] !== undefined) nc[k] = importedConfig[k];
          config = nc;
        }
        seleccionada=null;save();render();toast('Plan importado correctamente.');
      });
    }catch(err){toast('Error al importar: '+err.message);}
  };
  r.readAsText(file);e.target.value='';
}
function exportPDF(){openPDFOptions();}

function openPDFOptions(){
  closeCardMenu();
  var savedOrient=store.get('pe2_pdfOrient')||'landscape';
  var html='<div class="overlay" id="ovPDF"><div class="modal" style="max-width:440px"><div class="m-head"><h2>Exportar a PDF</h2><button class="m-x" id="pdfX">×</button></div>'+
    '<div class="m-body">'+
      '<p class="ai-intro">Se imprimirá tu plan de estudios en formato A4. Elegí la orientación más adecuada según tus períodos:</p>'+
      '<div class="field"><label>Orientación</label><div class="radio-row">'+
        '<label class="radio"><input type="radio" name="pdf_orient" value="landscape" '+(savedOrient==='landscape'?'checked':'')+'> <span>Horizontal (recomendado para 4+ períodos)</span></label>'+
        '<label class="radio"><input type="radio" name="pdf_orient" value="portrait" '+(savedOrient==='portrait'?'checked':'')+'> <span>Vertical (recomendado para 1–3 períodos)</span></label>'+
      '</div></div>'+
      '<p class="hint" style="margin-top:8px">En el diálogo de impresión que se abrirá, podés elegir "Guardar como PDF" como destino para descargarlo.</p>'+
    '</div>'+
    '<div class="m-foot"><div class="l"></div><div class="r"><button class="btn btn-light" id="pdfCancel">Cancelar</button><button class="btn btn-pri" id="pdfOk">Imprimir</button></div></div>'+
    '</div></div>';
  document.getElementById('modalRoot').innerHTML=html;
  var ov=document.getElementById('ovPDF');
  function close(){
    document.body.classList.remove('print-portrait','print-landscape');
    document.getElementById('modalRoot').innerHTML='';
    document.removeEventListener('keydown',ek);
  }
  function ek(e){if(e.key==='Escape')close();}
  document.addEventListener('keydown',ek);
  ov.addEventListener('mousedown',function(e){if(e.target===ov)close();});
  document.getElementById('pdfX').onclick=close;
  document.getElementById('pdfCancel').onclick=close;
  document.getElementById('pdfOk').onclick=function(){
    var orient=(document.querySelector('input[name="pdf_orient"]:checked')||{}).value||'landscape';
    store.set('pe2_pdfOrient',orient);
    document.body.classList.remove('print-portrait','print-landscape');
    document.body.classList.add('print-'+orient);
    close();
    setTimeout(function(){
      window.print();
      // Limpiar clase después de imprimir
      setTimeout(function(){document.body.classList.remove('print-portrait','print-landscape');},800);
    },100);
  };
}
function limpiar(){confirmar('Limpiar progreso','Se desmarcarán todas las aprobaciones y se borrarán las notas y vencimientos. ¿Continuar?',function(){materias.forEach(function(m){m.estado='pendiente';m.notas=[];m.regVence='';});save();render();});}
function wipe(){confirmar('Borrar todo','¿Borrar TODAS las materias del plan? Esta acción es definitiva.',function(){confirmar('Confirmar borrado','Vas a perder todo el plan. ¿Confirmás de nuevo?',function(){materias=[];seleccionada=null;save();render();});});}

/* ─── confirm modal propio ─── */
function confirmar(titulo,mensaje,onOk){
  var html='<div class="overlay" id="ovk"><div class="modal" style="max-width:440px"><div class="m-head"><h2>'+esc(titulo)+'</h2><button class="m-x" id="kx">×</button></div>'+
    '<div class="m-body"><p style="white-space:pre-line;line-height:1.5">'+esc(mensaje)+'</p></div>'+
    '<div class="m-foot"><div class="l"></div><div class="r"><button class="btn btn-light" id="kCancel">Cancelar</button><button class="btn btn-pri" id="kOk">Aceptar</button></div></div></div></div>';
  // pinear sobre cualquier modal existente
  var holder=document.createElement('div');holder.innerHTML=html;document.body.appendChild(holder);
  function close(){document.body.removeChild(holder);document.removeEventListener('keydown',ek);}
  function ek(e){if(e.key==='Escape')close();if(e.key==='Enter'){close();onOk();}}
  document.addEventListener('keydown',ek);
  holder.querySelector('#ovk').addEventListener('mousedown',function(e){if(e.target.id==='ovk')close();});
  holder.querySelector('#kx').onclick=close;
  holder.querySelector('#kCancel').onclick=close;
  holder.querySelector('#kOk').onclick=function(){close();onOk();};
  setTimeout(function(){holder.querySelector('#kOk').focus();},10);
}

/* ─── toast con acción opcional ─── */
var toastT;
function toast(msg,action){
  var r=document.getElementById('toastRoot');
  var btn=action?'<button class="toast-btn" id="toastBtn">'+esc(action.label)+'</button>':'';
  r.innerHTML='<div class="toast">'+esc(msg)+btn+'</div>';
  clearTimeout(toastT);
  if(action){
    document.getElementById('toastBtn').onclick=function(){action.fn();r.innerHTML='';};
    toastT=setTimeout(function(){r.innerHTML='';},6000);
  }else{
    toastT=setTimeout(function(){r.innerHTML='';},3400);
  }
}

/* ─── bind topbar / sidebar ─── */
document.getElementById('btnAdd').onclick=function(){openModal(null);};
document.getElementById('btnConfig').onclick=openConfig;
// Click en la versión del footer abre el modal "Acerca de"
// Click en la zona info del footer abre el modal "Acerca de"
document.querySelectorAll('.foot-info').forEach(function(el){el.style.cursor='pointer';el.addEventListener('click',openAbout);});
document.getElementById('fileInput').addEventListener('change',importData);
document.getElementById('btnPdf').onclick=exportPDF;
document.getElementById('btnClean').onclick=limpiar;
document.getElementById('btnAI').onclick=openAIPrompt;
document.getElementById('btnHelp').onclick=function(e){e.stopPropagation();openWelcome();};
document.getElementById('btnWipe').onclick=wipe;
document.getElementById('search').addEventListener('input',function(e){filtro=e.target.value;renderLista();});
function isMobile(){return window.matchMedia('(max-width:768px)').matches;}
function closeSidebarMobile(){document.getElementById('app').classList.remove('sb-open');}
document.getElementById('btnCollapse').onclick=function(){
  if(isMobile()){closeSidebarMobile();return;}
  collapsed=true;document.getElementById('app').classList.add('collapsed');
};
document.getElementById('btnExpand').onclick=function(){
  if(isMobile()){document.getElementById('app').classList.add('sb-open');return;}
  collapsed=false;document.getElementById('app').classList.remove('collapsed');
};
// Backdrop cierra sidebar en mobile
document.getElementById('sbBackdrop').onclick=closeSidebarMobile;
// En mobile, al tocar cualquier botón del sidebar (excepto el cierre que ya cierra), cerrar también
document.querySelectorAll('.sb-body .btn, .sb-body .lista-item, .sb-body .li').forEach(function(el){
  el.addEventListener('click',function(){if(isMobile())setTimeout(closeSidebarMobile,50);});
});
// Si la lista se renderiza dinámicamente, también delegamos
document.getElementById('listaScroll').addEventListener('click',function(e){
  if(isMobile()&&e.target.closest('.li'))setTimeout(closeSidebarMobile,50);
});
document.querySelector('.board-wrap').addEventListener('click',function(e){
  if(!e.target.closest('.card')&&seleccionada){seleccionada=null;render();}
});
document.getElementById('filterEstado').addEventListener('change',function(e){filtroEstado=e.target.value;render();});
// Limpiar sb-open al volver a desktop
window.addEventListener('resize',function(){if(!isMobile())document.getElementById('app').classList.remove('sb-open');});
// versiones
Array.prototype.forEach.call(document.querySelectorAll('.vlbl'),function(el){el.textContent=APP_VERSION;});
// atajos de teclado: Ctrl+Z deshacer
window.addEventListener('keydown',function(e){
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&undoStack&&!e.target.closest('input,textarea,select')){e.preventDefault();deshacer();}
});

render();

// ocultar loader inicial
(function(){
  var loader=document.getElementById('loader');if(!loader)return;
  var verEl=document.getElementById('loaderVerLbl');if(verEl)verEl.textContent=APP_VERSION;
  var minTime=1200,start=Date.now();
  function hide(){
    var elapsed=Date.now()-start;
    setTimeout(function(){
      loader.classList.add('hide');
      setTimeout(function(){loader.parentNode&&loader.parentNode.removeChild(loader);avisos();},450);
    },Math.max(0,minTime-elapsed));
  }
  if(document.readyState==='complete')hide();
  else window.addEventListener('load',hide);
})();

// avisos posteriores al loader
function avisos(){
  // 0) ¿Versión nueva desde la última visita? Mostrar novedades (no toca datos del usuario)
  if(storageOK){
    var lastSeen=store.get('pe2_lastSeenVersion');
    if(lastSeen&&lastSeen!==APP_VERSION){
      // mostrar todas las versiones más nuevas que la última vista
      var nuevas=[];
      for(var i=0;i<CHANGES_BY_VERSION.length;i++){
        if(CHANGES_BY_VERSION[i].v===lastSeen)break;
        nuevas.push(CHANGES_BY_VERSION[i]);
      }
      if(nuevas.length){openWhatsNew(nuevas);return;} // sale acá; otros avisos en próxima carga
      else{store.set('pe2_lastSeenVersion',APP_VERSION);} // versión desconocida, normalizar
    }else if(!lastSeen){
      // primera vez: guardar versión actual sin mostrar nada (no consideramos "actualización")
      store.set('pe2_lastSeenVersion',APP_VERSION);
    }
    // 0.5) Primer uso: mostrar guía de bienvenida si la app está limpia y no se vio antes
    var welcomeSeen=store.get('pe2_welcomeSeen');
    var planVacio=materias.length===0&&!config.carrera;
    if(!welcomeSeen&&planVacio){openWelcome();return;}
  }
  // 1) Modo incógnito / storage no disponible
  if(!storageOK){
    confirmar('Modo privado detectado',
      'Tu navegador no permite guardar datos en este sitio (modo incógnito, navegación privada o cookies bloqueadas).\n\n• Los cambios solo durarán mientras esta pestaña esté abierta.\n• Al cerrarla, todo se pierde.\n\nRecomendación: usá la app en una ventana normal, o exportá el plan a JSON antes de cerrar.',
      function(){});
    return; // si no hay storage, el recordatorio de export no tiene sentido
  }
  // 2) Recordatorio de export periódico
  if(store.get('pe2_dontRemindExport'))return;
  var last=store.get('pe2_lastExport');
  var now=Date.now();
  var DIAS=7,umbral=DIAS*24*60*60*1000;
  // primer aviso a los 7 días desde la primera carga si nunca exportó
  var first=store.get('pe2_firstSeen');
  if(!first){store.set('pe2_firstSeen',now);return;}
  var refer=last||first;
  if(now-refer<umbral)return;
  // mostrar toast con dos acciones
  setTimeout(function(){
    var r=document.getElementById('toastRoot');
    var dias=Math.floor((now-refer)/(24*60*60*1000));
    var msg=last?'Hace '+dias+' días que no exportás tu plan.':'Llevás '+dias+' días sin hacer un backup.';
    r.innerHTML='<div class="toast toast-wide"><div class="toast-msg">'+esc(msg)+' Te recomendamos guardarlo como JSON.</div>'+
      '<div class="toast-actions"><button class="toast-btn" id="tExp">Exportar ahora</button>'+
      '<button class="toast-btn toast-btn-ghost" id="tLater">Recordar luego</button>'+
      '<button class="toast-btn toast-btn-ghost" id="tNever">No recordar más</button></div></div>';
    document.getElementById('tExp').onclick=function(){exportData();r.innerHTML='';};
    document.getElementById('tLater').onclick=function(){store.set('pe2_lastExport',now);r.innerHTML='';}; // resetea el contador
    document.getElementById('tNever').onclick=function(){store.set('pe2_dontRemindExport',1);r.innerHTML='';};
  },500);
}

/* ─── PWA e Instalación ─── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js').catch(function(err) {
      console.log('SW registration failed: ', err);
    });
  });
}

var deferredPrompt = null;
window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  deferredPrompt = e;
  
  if (!store.get('pe2_installPromptShown')) {
    store.set('pe2_installPromptShown', true);
    setTimeout(showInstallModal, 1500);
  }
});

function showInstallModal() {
  if (!deferredPrompt) return;
  var html = '<div class="overlay" id="ovInstall" style="z-index:99999"><div class="modal" style="max-width:440px"><div class="m-head"><h2>Instalar Aplicación</h2><button class="m-x" id="instX">×</button></div>'+
    '<div class="m-body">'+
      '<p class="ai-intro">Podés instalar <b>Plan de Estudios Interactivo</b> en tu dispositivo para acceder más rápido, usarlo como una app nativa y funcionar sin conexión.</p>'+
    '</div>'+
    '<div class="m-foot"><div class="l"></div><div class="r"><button class="btn btn-light" id="instCancel">Ahora no</button><button class="btn btn-pri" id="instOk">Instalar</button></div></div>'+
    '</div></div>';
  
  var temp = document.createElement('div');
  temp.innerHTML = html;
  document.body.appendChild(temp.firstChild);
  
  var ov = document.getElementById('ovInstall');
  function close() {
    if(ov) ov.remove();
    document.removeEventListener('keydown', ek);
  }
  function ek(e) { if(e.key === 'Escape') close(); }
  document.addEventListener('keydown', ek);
  ov.addEventListener('mousedown', function(e) { if(e.target === ov) close(); });
  
  document.getElementById('instX').onclick = close;
  document.getElementById('instCancel').onclick = close;
  document.getElementById('instOk').onclick = function() {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function(choiceResult) {
      deferredPrompt = null;
      close();
    });
  };
}