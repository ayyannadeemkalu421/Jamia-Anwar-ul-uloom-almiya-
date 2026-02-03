// script.js

// JS Functions for Calculator + Firebase

// Add new row in Admin Panel
function addAdminRow(){
    let table=document.getElementById("resultTable");
    let row=table.insertRow();
    row.innerHTML=`
<td><select>
<option>متوسطہ</option>
<option>عامہ اوّل</option>
<option>عامہ دوم</option>
<option>خاصہ اوّل</option>
<option>خاصہ دوم</option>
<option>عالیہ اوّل</option>
<option>عالیہ دوم</option>
<option>عالمیہ اوّل</option>
<option>عالمیہ دوم</option>
<option>تخصص اوّل</option>
<option>تخصص دوم</option>
</select></td>
<td><input></td>
<td><input></td>
<td><input></td>
<td><input oninput="calculate(this)"></td>
<td><input oninput="calculate(this)"></td>
<td><input oninput="calculate(this)"></td>
<td><input oninput="calculate(this)"></td>
<td><input oninput="calculate(this)"></td>
<td><input oninput="calculate(this)"></td>
<td><input readonly></td>
<td><input readonly></td>
<td><input readonly></td>
<td><button onclick="deleteRow(this)">Delete</button></td>
`;
}

// Delete row
function deleteRow(btn){
    let row=btn.parentElement.parentElement;
    row.remove();
}

// Calculate total, grade, result
function calculate(el){
    let row=el.parentElement.parentElement;
    let total=0;
    for(let i=4;i<=9;i++){
        total+=Number(row.cells[i].children[0].value||0);
    }
    row.cells[10].children[0].value=total;

    let grade="",result="کامیاب";
    if(total>=480) grade="ممتاز";
    else if(total>=400) grade="جید جداً";
    else if(total>=300) grade="جید";
    else{ grade="ضعیف"; result="ناکام"; }

    row.cells[11].children[0].value=grade;
    row.cells[12].children[0].value=result;
}

// Save all results to Firebase
function saveResults(){
    let table=document.getElementById("resultTable");
    for(let i=1;i<table.rows.length;i++){
        let row=table.rows[i];
        let data={
            class: row.cells[0].children[0].value,
            roll: row.cells[1].children[0].value,
            name: row.cells[2].children[0].value,
            father: row.cells[3].children[0].value,
            hadees: Number(row.cells[4].children[0].value||0),
            fiqh: Number(row.cells[5].children[0].value||0),
            tafseer: Number(row.cells[6].children[0].value||0),
            aqaaid: Number(row.cells[7].children[0].value||0),
            arabic: Number(row.cells[8].children[0].value||0),
            nahu: Number(row.cells[9].children[0].value||0),
            total: Number(row.cells[10].children[0].value||0),
            grade: row.cells[11].children[0].value,
            result: row.cells[12].children[0].value
        };
        db.collection("results").doc(data.roll).set(data)
        .then(()=>{console.log("Saved: "+data.roll)})
        .catch(err=>{console.error(err)});
    }
    alert("All Results Saved Online!");
}

// Student Panel - Get Result
function getResult(){
    let roll=document.getElementById("rollInput").value.trim();
    let table=document.getElementById("studentResultTable");
    let row=document.getElementById("resultRow");
    if(roll==""){alert("Roll No درج کریں"); return;}
    db.collection("results").doc(roll).get()
    .then(doc=>{
        if(doc.exists){
            let data=doc.data();
            table.style.display="table";
            row.innerHTML=`
<td>${data.class}</td>
<td>${data.roll}</td>
<td>${data.name}</td>
<td>${data.father}</td>
<td>${data.hadees}</td>
<td>${data.fiqh}</td>
<td>${data.tafseer}</td>
<td>${data.aqaaid}</td>
<td>${data.arabic}</td>
<td>${data.nahu}</td>
<td>${data.total}</td>
<td>${data.grade}</td>
<td>${data.result}</td>
`;
        } else {
            alert("Result نہیں ملا");
            table.style.display="none";
        }
    })
    .catch(err=>{console.error(err)});
}
