// Iconos minimalistas de contorno redondeado (24x24). Sin dependencias.
(function(r){
const P={
trash:'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',man:'M12 3a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM5 21v-3a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v3zM12 14l-1.3 2.2L12 20l1.3-3.8z',trend:'M3 17l6-6 4 4 8-8M15 7h6v6',
cart:'M3 4h2l2.4 11h10.2l2-8H6M9 20.5h.01M17 20.5h.01',home:'M3 11l9-8 9 8M5 9.5V21h14V9.5M10 21v-6h4v6',book:'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11',
user:'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 21c0-4 3.5-6 8-6s8 2 8 6',woman:'M12 3a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM12 10l-5 11h10z',
car:'M3 14l2-6h14l2 6v4H3zM3 14h18M7.5 17.5h.01M16.5 17.5h.01',church:'M12 2v5M10 4h4M5 21V12l7-5 7 5v9M2 21h20M10 21v-5h4v5',cap:'M2 9l10-5 10 5-10 5zM6 11.5V16c3 2.5 9 2.5 12 0v-4.5',
coin:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v10M9.5 9.5h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4',medical:'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM12 7.5v9M7.5 12h9',
plane:'M21 3L3 10l7 3 3 8z',plus:'M12 4v16M4 12h16',tag:'M3 12V4h8l10 10-8 8zM7.5 8h.01',dots:'M5 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0M11 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0M17 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0',
cash:'M3 6h18v12H3zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6 12h.01M18 12h.01',store:'M3 9l1.5-5h15L21 9M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M5 12v9h14v-9M10 21v-5h4v5',
gift:'M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8c-3 0-5-1.5-5-3a2 2 0 0 1 3.5-1.2C11.5 5 12 8 12 8zM12 8c3 0 5-1.5 5-3a2 2 0 0 0-3.5-1.2C12.5 5 12 8 12 8z',
bag:'M5 8h14l-1 13H6zM9 8V6a3 3 0 0 1 6 0v2',leaf:'M5 19C5 10 10 5 20 5c0 10-5 14-14 14zM5 19l8-8',bottle:'M9 3h6M10 3v4l-2 3v10a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V10l-2-3V3M8 13h8',
meat:'M4 14c0-5 5-9 10-8s6 6 4 9-6 5-10 3c-2-.8-4-2-4-4z',chicken:'M16 3a5 5 0 0 1 3.5 8.5L14 17l-7-7 5.5-5.5A5 5 0 0 1 16 3zM8 15l-4 4M3 18l3 3',
bread:'M6 9a4 4 0 0 1 2-5h8a4 4 0 0 1 2 5v10H6z',apple:'M12 8c-2-2-7-1-7 4 0 4 3 9 5 9 1 0 1.2-.5 2-.5s1 .5 2 .5c2 0 5-5 5-9 0-5-5-6-7-4zM12 8c0-2 1-4 3-5',
egg:'M12 3c4 0 7 6 7 11a7 7 0 0 1-14 0c0-5 3-11 7-11z',bolt:'M13 2L4 14h7l-1 8 9-12h-7z',drop:'M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z',
wifi:'M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01',flame:'M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-9z',
sparkle:'M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z',fork:'M7 3v7M4.5 3v4a2.5 2.5 0 0 0 5 0V3M7 10v11M17 3c-2 2-3 5-3 8h3v10',
wrench:'M15 4a5 5 0 0 0-4 7l-7 7 2 2 7-7a5 5 0 0 0 7-4l-3 3-3-1-1-3z',pencil:'M4 20l1-5L16 4l4 4L9 19zM14 6l4 4',cup:'M5 8h12v5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5zM17 9h2a2 2 0 0 1 0 5h-2M8 3v2M12 3v2',
shirt:'M8 3L3 7l3 3 2-1v12h8V9l2 1 3-3-5-4a4 4 0 0 1-8 0z',bank:'M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18',
smile:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8.5 14a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01',heart:'M12 20s-8-5-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15 12 20 12 20z',
bus:'M5 4h14a1 1 0 0 1 1 1v11H4V5a1 1 0 0 1 1-1zM4 11h16M7 19v-3M17 19v-3M8 13.5h.01M16 13.5h.01',fuel:'M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h12M6 8h6M14 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-3-3',
gear:'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2',
parking:'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9.5 17V8H13a2.5 2.5 0 0 1 0 5H9.5',file:'M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h6',
users:'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5M17 5a3 3 0 0 1 0 6M19 14.5c2 .7 3 2.2 3 4.5',
pill:'M10.5 20.5l-7-7a4.9 4.9 0 0 1 7-7l7 7a4.9 4.9 0 0 1-7 7zM8.5 8.5l7 7',flask:'M9 3h6M10 3v6L4 19a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-6-10V3M7.5 15h9',
bed:'M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5M7 11.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',ball:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
trophy:'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4',calendar:'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',calweek:'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M8 14h8M8 17h5',
sun:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19',list:'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
repeat:'M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3',alert:'M12 3L2 20h20zM12 10v4M12 17.5h.01',down:'M12 5v14M6 13l6 6 6-6',up:'M12 19V5M6 11l6-6 6 6',scale:'M12 4v16M5 20h14M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z'};
const M={'Víveres Alimentos':'cart','Hogar':'home','Colegio hijos':'book','Rilan':'man','Ingrid':'woman','Auto':'car','Iglesia':'church','Universidad hijos':'cap','Préstamos':'coin','Salud':'medical','Viajes en familia':'plane','Nueva categoría':'plus',
'Sueldo':'cash','Negocio':'store','Ahorros':'coin','Regalo':'gift','Otros ingresos':'dots','Abarrotes':'bag','Verduras':'leaf','Lácteos':'bottle','Carne de res':'meat','Carne de pollo':'chicken','Pan/Masitas':'bread','Frutas':'apple','Huevo':'egg','Otro':'dots','Otros':'dots',
'Servicios básicos':'bolt','Aseo/Higiene personal':'sparkle','Comida fuera de casa':'fork','Mantenimiento':'wrench','Luz':'bolt','Agua':'drop','Internet':'wifi','Gas':'flame','Recreos':'ball','Materiales':'pencil','Pensiones':'cash','Cuotas/Aportes':'coin','Refrigerios':'cup','Refrigerio':'cup','Uniformes':'shirt',
'Banco':'bank','Coca/Extras':'cup','Ocio':'smile','Ayuda a familia':'heart','Ropa':'shirt','Herramientas':'wrench','Yanbal':'bag','Higiene personal':'sparkle','Transporte':'bus','Combustible':'fuel','Repuestos':'gear','Parqueo/Peajes':'parking','Diezmo/Ofrenda':'gift','Pasajes':'bus',
'Matrículas/Inscripciones':'file','De familia':'users','De amigos':'users','Medicamentos':'pill','Consulta médica':'medical','Laboratorio':'flask','Comida/Refrigerios':'fork','Pasajes/Combustible':'fuel','Parques/Hotel':'bed','Hospedaje':'bed','Sueldo escuela':'cash','Dividendo escuela':'bank','Trading':'trend','En mi familia':'home','En otras familias':'users',gasto:'down',ingreso:'up',vs:'scale'};
const CK={cart:'or',home:'cy',book:'pu',user:'cy',woman:'pu',car:'cy',church:'pu',cap:'pu',coin:'or',medical:'re',plane:'cy',plus:'cy',tag:'pu',dots:'cy',cash:'gr',store:'pu',gift:'pu',bag:'or',leaf:'gr',bottle:'cy',meat:'re',chicken:'or',bread:'or',apple:'re',egg:'or',bolt:'or',drop:'cy',wifi:'cy',flame:'or',sparkle:'cy',fork:'or',wrench:'cy',pencil:'pu',cup:'or',shirt:'pu',bank:'cy',smile:'or',heart:'re',bus:'cy',fuel:'or',gear:'cy',parking:'cy',file:'cy',users:'cy',pill:'re',flask:'cy',bed:'pu',ball:'or',down:'pu',up:'cy',scale:'or',man:'cy',trend:'gr'};
r.Icons={col:n=>'var(--c-'+(CK[M[n]||n]||'cy')+')',svg:n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[M[n]||n]||P.tag}"/></svg>`};
})(window);
