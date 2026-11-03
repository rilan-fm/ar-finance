(function(root){
function generar({rango,tot,porCat,filas,imgs}){
 const{jsPDF}=root.jspdf,d=new jsPDF(),F=root.Reports.fmt;let y=18;
 const lin=(t,x=14,s=10,b=false)=>{if(y>280){d.addPage();y=16}d.setFont('helvetica',b?'bold':'normal');d.setFontSize(s);d.text(String(t),x,y);y+=s*0.55+2};
 lin('Ar_Finance - Reporte',14,16,true);lin(rango,14,10);y+=2;
 lin('Ingresos: '+F(tot.ingresos)+'    Gastos: '+F(tot.gastos)+'    Balance: '+F(tot.balance),14,11,true);
 lin('Gasto promedio diario: '+F(tot.promDiario)+'    Movimientos: '+tot.n);y+=2;
 imgs.forEach(i=>{const w=182,h=w*i.h/i.w;if(y+h>285){d.addPage();y=16}d.addImage(i.img,'PNG',14,y,w,h,undefined,'FAST');y+=h+6});
 lin('Gastos por categoría',14,12,true);porCat.forEach(c=>lin(c.cat+': '+F(c.total),18));y+=3;
 lin('Movimientos',14,12,true);
 filas.forEach(m=>lin(m.fecha+'  '+(m.tipo==='ingreso'?'+':'-')+F(m.monto)+'  '+m.categoria+(m.subcategoria?' > '+m.subcategoria:'')+'  '+(m.descripcion||'').slice(0,45),16,9));
 d.save('reporte-finanzas.pdf');}
function generarBloques({titulo,periodo,paginas}){const{jsPDF}=root.jspdf,d=new jsPDF({orientation:'landscape'});
 paginas.forEach((p,i)=>{if(i)d.addPage();d.setFont('helvetica','bold');d.setFontSize(15);d.text('Ar_Finance - '+titulo,10,12);d.setFont('helvetica','normal');d.setFontSize(10);d.text(periodo,10,18);
  let w=277,h=w*p.h/p.w;if(h>180){h=180;w=h*p.w/p.h}d.addImage(p.img,'PNG',10,22,w,h,undefined,'FAST')});
 d.save('reporte-gastos.pdf')}
root.PDF={generar,generarBloques};
})(window);
