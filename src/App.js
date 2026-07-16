import React, { useState } from "react";
import "./App.css";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz5PGD_sFu9GVFmW87Hm2J0xBfFvHsfhRu9w1rXJZ6X6pfAcsbhcejI5nfKEVJUigsR/exec";

// ── Sector / Position / Professional Level data ───────────────────────────────
const SECTOR_DATA = {
  "Healthcare": {
    "Physician":      ["Resident","Specialist","Consultant","Other"],
    "Nurse":          ["Male Nurse","Diploma Nurse","BSN Nurse","Post RN","Charge Nurse","Head Nurse","Chief Nurse","Other"],
    "Allied Health":  ["Therapist","Radiographer","Lab Techniian","Pharmacist","Dietitian","Occupational Therapist","Speech Therapist","Medical Imaging","Other"],
  },
  "Engineering": {
    "Civil Engineer":       ["Graduate Engineer","Junior Engineer","Senior Engineer","Principal Engineer","Chief Engineer","Other"],
    "Mechanical Engineer":  ["Graduate Engineer","Junior Engineer","Senior Engineer","Principal Engineer","Chief Engineer","Other"],
    "Electrical Engineer":  ["Graduate Engineer","Junior Engineer","Senior Engineer","Principal Engineer","Chief Engineer","Other"],
    "Structural Engineer":  ["Graduate Engineer","Junior Engineer","Senior Engineer","Principal Engineer","Other"],
    "Chemical Engineer":    ["Graduate Engineer","Junior Engineer","Senior Engineer","Principal Engineer","Other"],
    "Project Manager":      ["Assistant PM","Project Manager","Senior PM","Other"],
    "Site Supervisor":      ["Supervisor","Senior Supervisor","General Supervisor","Other"],
    "QA / QC Engineer":     ["Inspector","Engineer","Senior Engineer","Other"],
    "Other":                ["Other"],
  },
  "Construction & Trades": {
    "Mason":                  ["Helper","Skilled Mason","Foreman","Other"],
    "Carpenter":              ["Helper","Skilled Carpenter","Foreman","Other"],
    "Electrician":            ["Helper","Electrician","Master Electrician","Foreman","Other"],
    "Plumber":                ["Helper","Plumber","Master Plumber","Foreman","Other"],
    "Welder":                 ["Helper","Welder 3G","Welder 6G","Foreman","Other"],
    "Painter":                ["Helper","Skilled Painter","Foreman","Other"],
    "Heavy Equipment Operator":["Operator","Senior Operator","Other"],
    "Scaffolder":             ["Scaffolder","Senior Scaffolder","Foreman","Other"],
    "HVAC Technician":        ["Helper","Technician","Senior Technician","Foreman","Other"],
    "Steel Fixer":            ["Helper","Skilled","Foreman","Other"],
    "Other":                  ["Other"],
  },
  "Oil & Gas": {
    "Process Operator":       ["Trainee","Operator","Senior Operator","Chief Operator","Other"],
    "Instrumentation Engineer":["Graduate","Junior","Senior","Lead","Other"],
    "Piping Engineer":        ["Graduate","Junior","Senior","Lead","Other"],
    "HSE Officer":            ["Officer","Senior Officer","Manager","Other"],
    "Drilling Engineer":      ["Junior","Senior","Lead","Other"],
    "Maintenance Technician": ["Technician","Senior Technician","Foreman","Other"],
    "Other":                  ["Other"],
  },
  "Information Technology": {
    "Software Developer":     ["Junior","Mid-Level","Senior","Lead","Other"],
    "Network Engineer":       ["Junior","Senior","Lead","Other"],
    "System Administrator":   ["Junior","Senior","Lead","Other"],
    "Cybersecurity Analyst":  ["Analyst","Senior Analyst","Lead","Other"],
    "Data Analyst":           ["Analyst","Senior Analyst","Lead","Other"],
    "IT Support":             ["L1 Support","L2 Support","L3 Support","Other"],
    "Other":                  ["Other"],
  },
  "Finance & Accounting": {
    "Accountant":       ["Junior Accountant","Accountant","Senior Accountant","Other"],
    "Auditor":          ["Junior Auditor","Auditor","Senior Auditor","Other"],
    "Finance Manager":  ["Manager","Senior Manager","Other"],
    "Financial Analyst":["Analyst","Senior Analyst","Other"],
    "Other":            ["Other"],
  },
  "Hospitality": {
    "Chef":             ["Commis Chef","Chef de Partie","Sous Chef","Head Chef","Executive Chef","Other"],
    "Hotel Management": ["Trainee","Supervisor","Manager","General Manager","Other"],
    "F&B Staff":        ["Waiter","Captain","Supervisor","Manager","Other"],
    "Housekeeping":     ["Attendant","Supervisor","Manager","Other"],
    "Front Desk":       ["Receptionist","Supervisor","Manager","Other"],
    "Other":            ["Other"],
  },
  "Logistics & Supply Chain": {
    "Driver":                ["Light Vehicle","Heavy Vehicle","Tanker","Other"],
    "Forklift Operator":     ["Operator","Senior Operator","Other"],
    "Warehouse Supervisor":  ["Supervisor","Senior Supervisor","Manager","Other"],
    "Logistics Coordinator": ["Coordinator","Senior Coordinator","Manager","Other"],
    "Other":                 ["Other"],
  },
  "Facility Management": {
    "Cleaning Supervisor":    ["Supervisor","Senior Supervisor","Manager","Other"],
    "Maintenance Technician": ["Technician","Senior Technician","Foreman","Other"],
    "Security Guard":         ["Guard","Senior Guard","Supervisor","Other"],
    "Other":                  ["Other"],
  },
  "Education": {
    "Teacher":       ["Trainee Teacher","Teacher","Senior Teacher","Head of Department","Other"],
    "Lecturer":      ["Lecturer","Senior Lecturer","Professor","Other"],
    "Administrator": ["Coordinator","Manager","Other"],
    "Other":         ["Other"],
  },
  "Retail & Sales": {
    "Sales Executive": ["Junior","Executive","Senior Executive","Other"],
    "Store Manager":   ["Assistant Manager","Manager","Senior Manager","Other"],
    "Merchandiser":    ["Junior","Senior","Other"],
    "Other":           ["Other"],
  },
  "General / Other": { "Other": ["Other"] },
};

const MONTHS      = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS        = Array.from({length:31},(_,i)=>String(i+1));
const PAST_YEARS  = Array.from({length:60},(_,i)=>new Date().getFullYear()-i);
const FUTURE_YEARS= Array.from({length:20},(_,i)=>new Date().getFullYear()+i);

// ── Helpers ───────────────────────────────────────────────────────────────────
function SectionHeader({number,title}){
  return(
    <div className="section-header">
      <span className="section-number">{number}</span>
      <span className="section-title">{title}</span>
    </div>
  );
}
function Field({label,required,children,hint}){
  return(
    <div className="field">
      <label className="field-label">{label}{required&&<span className="req">*</span>}</label>
      {hint&&<span className="field-hint">{hint}</span>}
      {children}
    </div>
  );
}
function DayMonthYearPicker({value,onChange,futureYears}){
  const [day,setDay]=useState(value?.day||"");
  const [month,setMonth]=useState(value?.month||"");
  const [year,setYear]=useState(value?.year||"");
  const yl=futureYears?FUTURE_YEARS:PAST_YEARS;
  const update=(d,m,y)=>{setDay(d);setMonth(m);setYear(y);if(d&&m&&y)onChange({day:d,month:m,year:y,display:`${String(d).padStart(2,'0')}/${String(MONTHS.indexOf(m)+1).padStart(2,'0')}/${y}`});};
  return(
    <div className="dmy-picker">
      <select className="input" value={day} onChange={e=>update(e.target.value,month,year)}><option value="">Day</option>{DAYS.map(d=><option key={d}>{d}</option>)}</select>
      <select className="input" value={month} onChange={e=>update(day,e.target.value,year)}><option value="">Month</option>{MONTHS.map(m=><option key={m}>{m}</option>)}</select>
      <select className="input" value={year} onChange={e=>update(day,month,e.target.value)}><option value="">Year</option>{yl.map(y=><option key={y}>{y}</option>)}</select>
    </div>
  );
}
function MonthYearPicker({value,onChange,futureYears}){
  const [month,setMonth]=useState(value?.month||"");
  const [year,setYear]=useState(value?.year||"");
  const yl=futureYears?FUTURE_YEARS:PAST_YEARS;
  const update=(m,y)=>{setMonth(m);setYear(y);if(m&&y)onChange({month:m,year:y,display:`01/${String(MONTHS.indexOf(m)+1).padStart(2,'0')}/${y}`});};
  return(
    <div className="month-year-picker">
      <select className="input select-half" value={month} onChange={e=>update(e.target.value,year)}><option value="">Month</option>{MONTHS.map(m=><option key={m}>{m}</option>)}</select>
      <select className="input select-half" value={year} onChange={e=>update(month,e.target.value)}><option value="">Year</option>{yl.map(y=><option key={y}>{y}</option>)}</select>
    </div>
  );
}
function DateRangePicker({value,onChange,allowPresent}){
  const [fromM,setFromM]=useState(value?.fromMonth||"");
  const [fromY,setFromY]=useState(value?.fromYear||"");
  const [toM,setToM]=useState(value?.toMonth||"");
  const [toY,setToY]=useState(value?.toYear||"");
  const buildDisplay=(fm,fy,tm,ty)=>{
    const from=fm&&fy?`${fm} ${fy}`:"";
    const to=tm==="Present"?"Present":(tm&&ty?`${tm} ${ty}`:"");
    return from&&to?`${from} – ${to}`:from||to;
  };
  const update=(fm,fy,tm,ty)=>{setFromM(fm);setFromY(fy);setToM(tm);setToY(ty);onChange({fromMonth:fm,fromYear:fy,toMonth:tm,toYear:ty,display:buildDisplay(fm,fy,tm,ty)});};
  return(
    <div className="date-range">
      <div className="date-range-row"><span className="date-range-label">From</span>
        <div className="month-year-picker">
          <select className="input select-half" value={fromM} onChange={e=>update(e.target.value,fromY,toM,toY)}><option value="">Month</option>{MONTHS.map(m=><option key={m}>{m}</option>)}</select>
          <select className="input select-half" value={fromY} onChange={e=>update(fromM,e.target.value,toM,toY)}><option value="">Year</option>{PAST_YEARS.map(y=><option key={y}>{y}</option>)}</select>
        </div>
      </div>
      <div className="date-range-row"><span className="date-range-label">To</span>
        <div className="month-year-picker">
          <select className="input select-half" value={toM} onChange={e=>update(fromM,fromY,e.target.value,toY)}><option value="">Month</option>{MONTHS.map(m=><option key={m}>{m}</option>)}{allowPresent&&<option value="Present">Present</option>}</select>
          {toM!=="Present"&&<select className="input select-half" value={toY} onChange={e=>update(fromM,fromY,toM,e.target.value)}><option value="">Year</option>{PAST_YEARS.map(y=><option key={y}>{y}</option>)}</select>}
        </div>
      </div>
    </div>
  );
}
function DateRangePickerNew({value,onChange,allowPresent}){
  const fmtDisplay = (d) => {
    if(!d) return "";
    const [y,m,day] = d.split("-");
   return `${day}/${m}/${y}`;
  };
  const [fromDate, setFromDate] = React.useState(value?.fromDate||"");
  const [toDate, setToDate]     = React.useState(value?.toDate||"");
  const [present, setPresent]   = React.useState(value?.toMonth==="Present"||false);

  const update = (fd, td, pres) => {
    setFromDate(fd); setToDate(td); setPresent(pres);
    const fromDisp = fd ? fmtDisplay(fd) : "";
    const toDisp   = pres ? "Present" : (td ? fmtDisplay(td) : "");
    const display  = fromDisp && toDisp ? `${fromDisp} to ${toDisp}` : fromDisp || toDisp;
    onChange({ fromDate: fd, toDate: pres?"":td, toMonth: pres?"Present":"", display });
  };

  return(
    <div className="date-range">
      <div className="date-range-row">
        <span className="date-range-label">From</span>
        <input type="date" className="input" value={fromDate}
          onChange={e=>update(e.target.value, toDate, present)}
          style={{maxWidth:"160px"}}/>
      </div>
      <div className="date-range-row">
        <span className="date-range-label">To</span>
        {!present && <input type="date" className="input" value={toDate}
          onChange={e=>update(fromDate, e.target.value, present)}
          style={{maxWidth:"160px"}}/>}
        {allowPresent && (
          <label className="present-label" style={{marginLeft:"8px",display:"flex",alignItems:"center",gap:"4px",fontSize:"13px"}}>
            <input type="checkbox" checked={present}
              onChange={e=>update(fromDate, toDate, e.target.checked)}/>
            Present
          </label>
        )}
      </div>
    </div>
  );
}

function FileUpload({label,accept,value,onChange,hint,icon}){
  const handleChange=async(e)=>{
    const file=e.target.files[0];
    if(!file)return;
    if(file.size > 10 * 1024 * 1024){ alert('File size exceeds 10MB limit. Please upload a smaller file.'); e.target.value=''; return; }
    const b64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej();r.readAsDataURL(file);});
    onChange({name:file.name,mimeType:file.type,base64:b64.split(",")[1]});
  };
  return(
    <div className="file-upload-wrap">
      {label&&<label className="file-label">{icon&&<span className="file-icon">{icon}</span>}{label}</label>}
      {hint&&<span className="field-hint">{hint}</span>}
      <label className="file-drop">
        <input type="file" accept={accept} onChange={handleChange} className="file-input"/>
        {value?<span className="file-chosen">✅ {value.name}</span>:<span className="file-placeholder">📎 Click to upload</span>}
      </label>
    </div>
  );
}
function InlineUpload({label,accept,value,onChange,hint}){
  const handleChange=async(e)=>{
    const file=e.target.files[0];
    if(!file)return;
    if(file.size > 10 * 1024 * 1024){ alert('File size exceeds 10MB limit. Please upload a smaller file.'); e.target.value=''; return; }
    const b64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej();r.readAsDataURL(file);});
    onChange({name:file.name,mimeType:file.type,base64:b64.split(",")[1]});
  };
  return(
    <label className="inline-upload">
      <input type="file" accept={accept} onChange={handleChange} className="file-input"/>
      {value
        ?<span className="inline-chosen">✅ {value.name}</span>
        :<span className="inline-placeholder">📎 {label}</span>
      }
    </label>
  );
}
function AddRowButton({onClick,label}){return <button type="button" className="add-row-btn" onClick={onClick}>+ Add {label}</button>;}
function RemoveRowButton({onClick}){return <button type="button" className="remove-row-btn" onClick={onClick}>✕</button>;}
function UploadGroup({title,uploads}){
  return(
    <div className="upload-group">
      <div className="upload-group-title">📎 {title}</div>
      <div className="upload-grid">
        {uploads.map((u,i)=><InlineUpload key={i} label={u.label} accept={u.accept||"application/pdf"} value={u.value} onChange={u.onChange}/>)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App(){
  const [step,setStep]=useState("form");
  const [errorMsg,setErrorMsg]=useState("");

  // Applying For
  const [applyingFor,setApplyingFor]=useState("");
  const [applyingForOther,setApplyingForOther]=useState("");

  // S1 — Position
  const [sector,setSector]=useState("");
  const [position,setPosition]=useState("");
  const [profLevel,setProfLevel]=useState("");
  const [specialty,setSpecialty]=useState("");

  // S2 — Key Skills
  const [skills,setSkills]=useState(["","","","","","","",""]);

  // S3 — Personal
  const [fullName,setFullName]=useState("");
  const [cnic,setCnic]=useState("");
  const [cnicError,setCnicError]=useState("");
  const [passportNo,setPassportNo]=useState("");
  const [passportExpiry,setPassportExpiry]=useState(null);
  const [dob,setDob]=useState(null);
  const [gender,setGender]=useState("");
  const [nationality,setNationality]=useState("");
  const [religion,setReligion]=useState("");
  const [maritalStatus,setMaritalStatus]=useState("");
  const [height,setHeight]=useState("");
  const [weight,setWeight]=useState("");
  const [gccExp,setGccExp]=useState("");
  const [english,setEnglish]=useState("");
  const [dependents,setDependents]=useState("");
  const [availability,setAvailability]=useState("");
  const [email,setEmail]=useState("");
  const [phone,setPhone]=useState("");
  const [address,setAddress]=useState("");

  // S4 — Education
  const [qualLevel,setQualLevel]=useState("");
  const [gradCountry,setGradCountry]=useState("");
  const [qualifications,setQualifications]=useState([
    {dateRange:null,degree:"",institution:"",country:""},
    {dateRange:null,degree:"",institution:"",country:""},
    {dateRange:null,degree:"",institution:"",country:""},
  ]);

  // S5 — Training
  const [training,setTraining]=useState([
    {dateRange:null,discipline:"",institution:"",country:""},
    {dateRange:null,discipline:"",institution:"",country:""},
  ]);

  // S6 — Licensing
  const [licenses,setLicenses]=useState([
    {licensingBody:"",country:"",designation:"",licenseNo:"",issueDate:"",expiryDate:""},
    {licensingBody:"",country:"",designation:"",licenseNo:"",issueDate:"",expiryDate:""},
  ]);

  // S7 — Experience
  const [experience,setExperience]=useState([
    {dateRange:null,position:"",institution:"",country:""},
    {dateRange:null,position:"",institution:"",country:""},
    {dateRange:null,position:"",institution:"",country:""},
    {dateRange:null,position:"",institution:"",country:""},
  ]);

  // NGHA Additional Fields
  const [nghaLocations,setNghaLocations]=useState([]);
  const [placeOfBirth,setPlaceOfBirth]=useState("");
  const [permanentAddress,setPermanentAddress]=useState("");
  const [currentAddress,setCurrentAddress]=useState("");
  const [spouseName,setSpouseName]=useState("");
  const [spouseInKingdom,setSpouseInKingdom]=useState("");
  const [iqamaNo,setIqamaNo]=useState("");
  const [companySponsor,setCompanySponsor]=useState("");
  const [visaType,setVisaType]=useState("");
  const [emergencyName,setEmergencyName]=useState("");
  const [emergencyRelation,setEmergencyRelation]=useState("");
  const [emergencyMobile,setEmergencyMobile]=useState("");
  const [lastEmploymentDate,setLastEmploymentDate]=useState("");
  const [currentlyEmployed,setCurrentlyEmployed]=useState("");
  const [dateLeft,setDateLeft]=useState(null);
  const [references,setReferences]=useState([
    {name:"",jobTitle:"",home:"",work:"",email:"",consent:""},
    {name:"",jobTitle:"",home:"",work:"",email:"",consent:""},
  ]);
  const [disclosure,setDisclosure]=useState([
    {name:"",position:"",department:"",relationship:""},
    {name:"",position:"",department:"",relationship:""},
    {name:"",position:"",department:"",relationship:""},
    {name:"",position:"",department:"",relationship:""},
    {name:"",position:"",department:"",relationship:""},
  ]);

  const [applicantSignature,setApplicantSignature]=useState('');

  // Documents
  const [docs,setDocs]=useState({});
  const [photoPreview,setPhotoPreview]=useState(null);

  const setDoc=(key,val)=>{
    setDocs(prev=>({...prev,[key]:val}));
    if(key==="photo"&&val) setPhotoPreview(`data:${val.mimeType};base64,${val.base64}`);
  };

  const handleCnic=(v)=>{
    const d=v.replace(/\D/g,"").slice(0,13);
    setCnic(d);
    setCnicError(d.length>0&&d.length!==13?"CNIC must be exactly 13 digits":"");
  };
  const updateRow=(setter,i,field,val)=>setter(prev=>prev.map((r,idx)=>idx===i?{...r,[field]:val}:r));
  const addRow=(setter,tmpl)=>setter(prev=>[...prev,{...tmpl}]);
  const removeRow=(setter,i)=>setter(prev=>prev.filter((_,idx)=>idx!==i));
  const fmt=(d)=>d?.display||"";

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(cnic.length!==13){setCnicError("CNIC must be exactly 13 digits");return;}
    setStep("submitting");
    const payload={
      applyingFor,applyingForOther,
      sector,position,profLevel,specialty,
      skills:skills.filter(s=>s.trim()),
      fullName,cnic,passportNo,placeOfBirth,
      passportExpiry:fmt(passportExpiry),
      dob:fmt(dob),age:dob?.year?String(new Date().getFullYear()-parseInt(dob.year)):'',gender,nationality,religion,maritalStatus,
      height,weight,gccExp,english,dependents,availability,
      email,phone,address,emergencyName,emergencyMobile,currentlyEmployed,dateLeft:fmt(dateLeft),
      qualLevel,gradCountry,
      qualifications:qualifications.map(q=>({date:fmt(q.dateRange),degree:q.degree,institution:q.institution,country:q.country})),
      training:training.map(t=>({date:fmt(t.dateRange),discipline:t.discipline,institution:t.institution,country:t.country,courseTitle:t.courseTitle||''})),
      licenses:licenses.map(l=>({licensingBody:l.licensingBody,country:l.country,designation:l.designation,licenseNo:l.licenseNo,issueDate:l.issueDate||"",expiryDate:l.expiryDate||"",authority:l.licensingBody})),
      experience:experience.map(ex=>({date:fmt(ex.dateRange),position:ex.position,institution:ex.institution,country:ex.country,wardUnit:ex.wardUnit||''})),
      applicantSignature,
      documents:docs,
      // NGHA Additional Fields
      nghaLocations,placeOfBirth,permanentAddress,currentAddress,
      spouseName,spouseInKingdom,iqamaNo,companySponsor,visaType,
      emergencyName,emergencyRelation,emergencyMobile,
      lastEmploymentDate,currentlyEmployed,dateLeft,
      references:references.map(r=>({name:r.name,jobTitle:r.jobTitle,home:r.home,work:r.work,email:r.email,consent:r.consent})),
      disclosure:disclosure.map(d=>({name:d.name,position:d.position,department:d.department,relationship:d.relationship})),
    };
    try{
      // Strip documents from main payload — too large for URL encoding
      // Send as JSON via fetch with text/plain to avoid CORS preflight
      const {documents:_docs, ...textPayload} = payload;
      await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {"Content-Type": "text/plain"},
        mode: "no-cors",
      });
      setStep("success");
    }catch(err){setErrorMsg(err.message);setStep("error");}
  };

  if(step==="success") return(
    <div className="page-wrap"><div className="status-card">
      <div className="status-icon">✅</div>
      <h2>Application Submitted!</h2>
      <p>Thank you <strong>{fullName}</strong>. Your application has been received and will be reviewed shortly.</p>
      <p className="success-ref">Reference CNIC: {cnic}</p>
    </div></div>
  );
  if(step==="submitting") return(
    <div className="page-wrap"><div className="status-card">
      <div className="spinner"/><h2>Submitting your application...</h2>
      <p>Please wait, do not close this page.</p>
    </div></div>
  );
  if(step==="error") return(
    <div className="page-wrap"><div className="status-card">
      <div className="status-icon">❌</div><h2>Submission Failed</h2>
      <p>{errorMsg}</p>
      <button className="btn-primary" onClick={()=>setStep("form")}>Try Again</button>
    </div></div>
  );

  const sectors   =Object.keys(SECTOR_DATA);
  const positions =sector?Object.keys(SECTOR_DATA[sector]||{})  :[];
  const levels    =(sector&&position)?(SECTOR_DATA[sector]?.[position]||[]):[];

  return(
    <div className="page-wrap">

      {/* HEADER */}
      <header className="form-header">
        <div className="header-inner">
          <img src="/logo.png" alt="Al Najam International" className="header-logo"/>
          <div className="header-text">
            <h1 className="header-title">RECRUITMENT APPLICATION FORM</h1>
            <p className="header-sub">Al Najam International — Human Resource Providers Since 1971 &nbsp;|&nbsp; License # 0899/LHR</p>
          </div>
        </div>
        <div className="header-bar"/>
      </header>

      <form className="form-body" onSubmit={handleSubmit} onKeyDown={e=>{if(e.key==="Enter"&&e.target.type!=="submit")e.preventDefault();}}>

        {/* ── SECTION 1: POSITION ── */}
        <div className="section-card">
          <SectionHeader number="0" title="Application For"/>
          <div className="fields-grid">
            <Field label="Which organisation are you applying to?" required>
              <select className="input" value={applyingFor} onChange={e=>{setApplyingFor(e.target.value);setApplyingForOther("");}} required>
                <option value="">Select Organisation</option>
                <option value="NGHA">NGHA — National Guards Health Affairs</option>
                <option value="MOH">MOH — Saudi Health Cluster</option>
                <option value="MODA">MODA — Ministry of Defence</option>
                <option value="Other">Other</option>
              </select>
            </Field>
            {applyingFor==="Other" && (
              <Field label="Please specify">
                <input className="input" value={applyingForOther} onChange={e=>setApplyingForOther(e.target.value)} placeholder="Organisation name"/>
              </Field>
            )}
          </div>
        </div>

        <SectionHeader number="1" title="Position Applying For"/>
        <div className="form-grid-2">
          <Field label="Sector" required>
            <select className="input" value={sector} onChange={e=>{setSector(e.target.value);setPosition("");setProfLevel("");}} required>
              <option value="">Select Sector</option>
              {sectors.map(s=><option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Position">
            <select className="input" value={position} onChange={e=>{setPosition(e.target.value);setProfLevel("");}} disabled={!sector}>
              <option value="">Select Position</option>
              {positions.map(p=><option key={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Professional Level">
            <select className="input" value={profLevel} onChange={e=>setProfLevel(e.target.value)} disabled={!position}>
              <option value="">Select Level</option>
              {levels.map(l=><option key={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Specialty">
            <input className="input" value={specialty} onChange={e=>setSpecialty(e.target.value)} placeholder="e.g. Cardiology, Structural, AutoCAD"/>
          </Field>
        </div>
        {/* ── SECTION 2: KEY SKILLS ── */}
        <SectionHeader number="2" title="Key Skills"/>
        <p className="section-note">Enter up to 8 skills relevant to your position (e.g. Patient Assessment, AutoCAD, Project Budgeting)</p>
        <div className="form-grid-4">
          {skills.map((s,i)=>(
            <input key={i} className="input skill-input" value={s}
              onChange={e=>setSkills(prev=>prev.map((sk,idx)=>idx===i?e.target.value:sk))}
              placeholder={`Skill ${i+1}`}/>
          ))}
        </div>

        <SectionHeader number="3" title="Personal & Identity Information"/>

        {/* Row 1: Full Name + CNIC */}
        <div className="form-grid-2">
          <Field label="Full Name — as per your degree" required>
            <input className="input" value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Full name as per your degree" required/>
          </Field>
          <Field label="CNIC" required>
            <input className="input" value={cnic} onChange={e=>handleCnic(e.target.value)} placeholder="13 digits, no dashes or spaces" maxLength={13} required/>
            {cnicError&&<span className="error-msg">{cnicError}</span>}
          </Field>
        </div>

        {/* Row 2: Passport */}
        <div className="form-grid-2" style={{marginTop:"14px"}}>
          <Field label="Passport Number">
            <input className="input" value={passportNo} onChange={e=>setPassportNo(e.target.value)} placeholder="AB1234567"/>
          </Field>
          <Field label="Passport Expiry">
            <DayMonthYearPicker value={passportExpiry} onChange={setPassportExpiry} futureYears={true}/>
          </Field>
        </div>

        {/* Row 3: DOB + Place of Birth + Age (auto) */}
        <div className="form-grid-3" style={{marginTop:"14px"}}>
          <Field label="Date of Birth">
            <DayMonthYearPicker value={dob} onChange={setDob}/>
          </Field>
          <Field label="Place of Birth">
            <input className="input" value={placeOfBirth} onChange={e=>setPlaceOfBirth(e.target.value)} placeholder="e.g. Lahore, Pakistan"/>
          </Field>
          <Field label="Age">
            <div className="age-display">
              {dob?.year && dob?.month && dob?.day
                ? `${new Date().getFullYear() - parseInt(dob.year)} years`
                : <span style={{color:"#aaa",fontSize:"12px"}}>Auto-calculated from DOB</span>}
            </div>
          </Field>
        </div>

        {/* Row 4: Gender + Nationality + Religion */}
        <div className="form-grid-3" style={{marginTop:"14px"}}>
          <Field label="Gender">
            <select className="input" value={gender} onChange={e=>setGender(e.target.value)}>
              <option value="">Select</option><option>Male</option><option>Female</option>
            </select>
          </Field>
          <Field label="Nationality">
            <input className="input" value={nationality} onChange={e=>setNationality(e.target.value)} placeholder="e.g. Pakistani"/>
          </Field>
          <Field label="Religion">
            <input className="input" value={religion} onChange={e=>setReligion(e.target.value)} placeholder="e.g. Islam"/>
          </Field>
        </div>

        {/* Row 5: Marital + Dependents + Height + Weight */}
        <div className="form-grid-4" style={{marginTop:"14px"}}>
          <Field label="Marital Status">
            <select className="input" value={maritalStatus} onChange={e=>setMaritalStatus(e.target.value)}>
              <option value="">Select</option><option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
            </select>
          </Field>
          <Field label="Dependents">
            <input className="input" type="number" min="0" value={dependents} onChange={e=>setDependents(e.target.value)} placeholder="0"/>
          </Field>
          <Field label="Height (cm)">
            <input className="input" value={height} onChange={e=>setHeight(e.target.value)} placeholder="e.g. 175"/>
          </Field>
          <Field label="Weight (kg)">
            <input className="input" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="e.g. 75"/>
          </Field>
        </div>

        {/* Spouse details — shown when Married */}
        {maritalStatus==="Married" && (
          <div className="form-grid-2" style={{marginTop:"14px"}}>
            <Field label="Name of Spouse (Last, First)">
              <input className="input" value={spouseName} onChange={e=>setSpouseName(e.target.value)} placeholder="Last name, First name"/>
            </Field>
            <Field label="Is Spouse living in the Kingdom?">
              <select className="input" value={spouseInKingdom} onChange={e=>setSpouseInKingdom(e.target.value)}>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </Field>
            {spouseInKingdom==="Yes" && <>
              <Field label="Iqama / Residency Permit No.">
                <input className="input" value={iqamaNo} onChange={e=>setIqamaNo(e.target.value)} placeholder="Iqama number"/>
              </Field>
              <Field label="Company / Sponsor">
                <input className="input" value={companySponsor} onChange={e=>setCompanySponsor(e.target.value)} placeholder="Company or sponsor name"/>
              </Field>
              <Field label="Visa Type">
                <select className="input" value={visaType} onChange={e=>setVisaType(e.target.value)}>
                  <option value="">Select</option>
                  <option value="Work">Work</option>
                  <option value="Dependent">Dependent</option>
                  <option value="Visit">Visit</option>
                </select>
              </Field>
            </>}
          </div>
        )}

        {/* Row 6: GCC + English + Availability */}
        <div className="form-grid-3" style={{marginTop:"14px"}}>
          <Field label="Worked in KSA / GCC Before?">
            <select className="input" value={gccExp} onChange={e=>setGccExp(e.target.value)}>
              <option value="">Select</option><option>Yes</option><option>No</option>
            </select>
          </Field>
          <Field label="English Proficiency">
            <select className="input" value={english} onChange={e=>setEnglish(e.target.value)}>
              <option value="">Select</option><option>Basic</option><option>Intermediate</option><option>Good</option><option>Fluent</option>
            </select>
          </Field>
          <Field label="Availability to Join">
            <select className="input" value={availability} onChange={e=>setAvailability(e.target.value)}>
              <option value="">Select</option><option>Immediate</option><option>1 Month</option><option>2 Months</option><option>3 Months</option><option>6 Months</option><option>Other</option>
            </select>
          </Field>
        </div>

        {/* Contact block */}
        <div className="contact-block" style={{marginTop:"16px"}}>
          <div className="contact-block-title">📍 Contact Details</div>
          <div className="form-grid-2">
            <Field label="Email Address" required>
              <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@example.com" required/>
            </Field>
            <Field label="Mobile Number" required>
              <input className="input" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+92 300 1234567" required/>
            </Field>
          </div>
          <Field label="Home Address" style={{marginTop:"10px"}}>
            <textarea className="input textarea" value={address} onChange={e=>setAddress(e.target.value)} placeholder="Full home address" rows={2}/>
          </Field>
        </div>

        {/* Emergency contact block */}
        <div className="emergency-block">
          <div className="emergency-block-title">🚨 Emergency Contact</div>
          <div className="form-grid-2">
            <Field label="Name & Relationship">
              <input className="input" value={emergencyName} onChange={e=>setEmergencyName(e.target.value)} placeholder="e.g. Ahmed Khan — Brother"/>
            </Field>
            <Field label="Mobile">
              <input className="input" value={emergencyMobile} onChange={e=>setEmergencyMobile(e.target.value)} placeholder="+92 300 1234567"/>
            </Field>
          </div>
        </div>

        {/* Employment status block */}
        <div className="employment-block">
          <div className="employment-block-title">💼 Current Employment Status</div>
          <div className="form-grid-2">
            <Field label="Currently Employed?">
              <select className="input" value={currentlyEmployed} onChange={e=>setCurrentlyEmployed(e.target.value)}>
                <option value="">Select</option><option value="Yes">Yes</option><option value="No">No</option>
              </select>
            </Field>
            {currentlyEmployed==="No" && (
              <Field label="Date Left Last Employment">
                <DayMonthYearPicker value={dateLeft} onChange={setDateLeft}/>
              </Field>
            )}
          </div>
        </div>

        {/* ── SECTION 4: EDUCATION ── */}
        <SectionHeader number="4" title="Education (most recent first)"/>
        <div className="form-grid-2">
          <Field label="Highest Qualification Level">
            <select className="input" value={qualLevel} onChange={e=>setQualLevel(e.target.value)}>
              <option value="">Select</option>
              <option>Under Matric</option>
              <option>Secondary (Matric / O-Level)</option>
              <option>Higher Secondary (FSc / A-Level)</option>
              <option>Diploma</option>
              <option>Bachelor's Degree</option>
              <option>Master's Degree</option>
              <option>Membership (MRCP, MRCS etc.)</option>
              <option>Fellowship (FCPS, FRCS etc.)</option>
              <option>Doctorate (PhD)</option>
              <option>Post-Doctorate</option>
              <option>Other</option>
            </select>
          </Field>
          <Field label="Country of Graduation">
            <input className="input" value={gradCountry} onChange={e=>setGradCountry(e.target.value)} placeholder="e.g. Pakistan"/>
          </Field>
        </div>
        {qualifications.map((q,i)=>(
          <div key={i} className="repeating-row">
            <div className="repeating-row-header">
              <span className="row-num">#{i+1}</span>
              {qualifications.length>1&&<RemoveRowButton onClick={()=>removeRow(setQualifications,i)}/>}
            </div>
            <div className="form-grid-2">
              <Field label="Date Range"><DateRangePickerNew value={q.dateRange} onChange={v=>updateRow(setQualifications,i,"dateRange",v)} allowPresent={false}/></Field>
              <Field label="Qualification / Degree"><input className="input" value={q.degree} onChange={e=>updateRow(setQualifications,i,"degree",e.target.value)} placeholder="e.g. MBBS, B.Sc Engineering"/></Field>
              <Field label="Institution"><input className="input" value={q.institution} onChange={e=>updateRow(setQualifications,i,"institution",e.target.value)} placeholder="University / College name"/></Field>
              <Field label="Country"><input className="input" value={q.country} onChange={e=>updateRow(setQualifications,i,"country",e.target.value)} placeholder="e.g. Pakistan"/></Field>
            </div>
          </div>
        ))}
        <AddRowButton onClick={()=>addRow(setQualifications,{dateRange:null,degree:"",institution:"",country:""})} label="Qualification"/>


        {/* ── SECTION 5: TRAINING ── */}
        <SectionHeader number="5" title="Training"/>
        {training.map((t,i)=>(
          <div key={i} className="repeating-row">
            <div className="repeating-row-header">
              <span className="row-num">#{i+1}</span>
              {training.length>1&&<RemoveRowButton onClick={()=>removeRow(setTraining,i)}/>}
            </div>
            <div className="form-grid-2">
              <Field label="Date Range"><DateRangePickerNew value={t.dateRange} onChange={v=>updateRow(setTraining,i,"dateRange",v)} allowPresent={false}/></Field>
              <Field label="Discipline / Specialty"><input className="input" value={t.discipline} onChange={e=>updateRow(setTraining,i,"discipline",e.target.value)} placeholder="e.g. Advanced Bronchoscopy"/></Field>
              <Field label="Institution"><input className="input" value={t.institution} onChange={e=>updateRow(setTraining,i,"institution",e.target.value)} placeholder="Institution name"/></Field>
              <Field label="Country"><input className="input" value={t.country} onChange={e=>updateRow(setTraining,i,"country",e.target.value)} placeholder="e.g. Pakistan"/></Field>
              <Field label="Course Title" hint="Required for NGHA Nurse / Allied Health applications"><input className="input" value={t.courseTitle||""} onChange={e=>updateRow(setTraining,i,"courseTitle",e.target.value)} placeholder="e.g. Advanced ICU Care Certificate"/></Field>
            </div>
          </div>
        ))}
        <AddRowButton onClick={()=>addRow(setTraining,{dateRange:null,discipline:"",institution:"",country:""})} label="Training"/>


        {/* ── SECTION 6: LICENSING ── */}
        <SectionHeader number="6" title="Professional Licenses"/>
        {licenses.map((l,i)=>(
          <div key={i} className="repeating-row">
            <div className="repeating-row-header">
              <span className="row-num">#{i+1}</span>
              {licenses.length>1&&<RemoveRowButton onClick={()=>removeRow(setLicenses,i)}/>}
            </div>
            <div className="form-grid-2">
              <Field label="Issue Date"><input type="date" className="input" value={l.issueDate||""} onChange={e=>updateRow(setLicenses,i,"issueDate",e.target.value)} style={{maxWidth:"160px"}}/></Field>
              <Field label="Expiry Date"><input type="date" className="input" value={l.expiryDate||""} onChange={e=>updateRow(setLicenses,i,"expiryDate",e.target.value)} style={{maxWidth:"160px"}}/></Field>
              <Field label="Licensing Body"><input className="input" value={l.licensingBody} onChange={e=>updateRow(setLicenses,i,"licensingBody",e.target.value)} placeholder="e.g. PMDC, DHA, MOH Saudi Arabia"/></Field>
              <Field label="Country"><input className="input" value={l.country} onChange={e=>updateRow(setLicenses,i,"country",e.target.value)} placeholder="e.g. Pakistan, Saudi Arabia"/></Field>
              <Field label="Designation"><input className="input" value={l.designation} onChange={e=>updateRow(setLicenses,i,"designation",e.target.value)} placeholder="e.g. Physician, Registered Nurse"/></Field>
              <Field label="License Number"><input className="input" value={l.licenseNo} onChange={e=>updateRow(setLicenses,i,"licenseNo",e.target.value)} placeholder="e.g. PMDC-12345"/></Field>
            </div>
          </div>
        ))}
        <AddRowButton onClick={()=>addRow(setLicenses,{licensingBody:"",country:"",designation:"",licenseNo:"",issueDate:null,expiryDate:null})} label="License"/>


        {/* ── SECTION 7: EXPERIENCE ── */}
        <SectionHeader number="7" title="Work Experience (most recent first)"/>
        {experience.map((ex,i)=>(
          <div key={i} className="repeating-row">
            <div className="repeating-row-header">
              <span className="row-num">#{i+1}</span>
              {experience.length>1&&<RemoveRowButton onClick={()=>removeRow(setExperience,i)}/>}
            </div>
            <div className="form-grid-2">
              <Field label="Date Range"><DateRangePickerNew value={ex.dateRange} onChange={v=>updateRow(setExperience,i,"dateRange",v)} allowPresent={true}/></Field>
              <Field label="Position / Designation"><input className="input" value={ex.position} onChange={e=>updateRow(setExperience,i,"position",e.target.value)} placeholder="e.g. Consultant Physician"/></Field>
              <Field label="Institution / Employer"><input className="input" value={ex.institution} onChange={e=>updateRow(setExperience,i,"institution",e.target.value)} placeholder="Hospital / Company name"/></Field>
              <Field label="Country"><input className="input" value={ex.country} onChange={e=>updateRow(setExperience,i,"country",e.target.value)} placeholder="e.g. Pakistan"/></Field>
              <Field label="Ward / Unit / Dept — Nurses Only" hint="No. of beds in unit / nurse-to-patient ratio, if applicable"><input className="input" value={ex.wardUnit||""} onChange={e=>updateRow(setExperience,i,"wardUnit",e.target.value)} placeholder="e.g. ICU — 20 beds — 1:2 ratio"/></Field>
            </div>
          </div>
        ))}
        <AddRowButton onClick={()=>addRow(setExperience,{dateRange:null,position:"",institution:"",country:""})} label="Experience"/>


        {/* ── SECTION 8: WORK REFERENCES ── */}
        <SectionHeader number="8" title="Work References"/>
        <p className="section-note">Please provide 2 work-related references who may be contacted.</p>
        {references.map((r,i)=>(
          <div key={i} className="repeating-row">
            <div className="repeating-row-header"><span className="row-num">Reference {i+1}</span></div>
            <div className="form-grid-2">
              <Field label="Full Name"><input className="input" value={r.name} onChange={e=>updateRow(setReferences,i,"name",e.target.value)} placeholder="Full name"/></Field>
              <Field label="Position / Job Title"><input className="input" value={r.jobTitle} onChange={e=>updateRow(setReferences,i,"jobTitle",e.target.value)} placeholder="Job title"/></Field>
              <Field label="Place of Work / Organisation"><input className="input" value={r.work} onChange={e=>updateRow(setReferences,i,"work",e.target.value)} placeholder="Hospital / Company name"/></Field>
              <Field label="Work Phone"><input className="input" value={r.home} onChange={e=>updateRow(setReferences,i,"home",e.target.value)} placeholder="+92 42 7654321"/></Field>
              <Field label="Email"><input className="input" value={r.email} onChange={e=>updateRow(setReferences,i,"email",e.target.value)} placeholder="reference@hospital.com"/></Field>
              <Field label="Consent to Contact">
                <select className="input" value={r.consent} onChange={e=>updateRow(setReferences,i,"consent",e.target.value)}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No — will not be contacted until consent is sought">No — will not be contacted until consent is sought</option>
                </select>
              </Field>
            </div>
          </div>
        ))}

        {/* SUBMIT */}

        {/* NGHA Additional Section — shown only for NGHA + Nurse or Allied Health */}
        {applyingFor==="NGHA" && (sector==="Healthcare") && (position==="Nurse"||position==="Allied Health") && (
          <div className="section-card ngha-additional">
            <SectionHeader number="8" title="NGHA Additional Information"/>
            <p className="section-note">This section is required for NGHA applications for Nurses and Allied Health positions.</p>

            {/* Preferred Location */}
            <Field label="Preferred Location for Employment">
              <div className="checkbox-group">
                {["Riyadh","Jeddah","Madinah","Al Ahsa","Dammam","PHCs","No Preference"].map(loc=>(
                  <label key={loc} className="checkbox-label">
                    <input type="checkbox" checked={nghaLocations.includes(loc)}
                      onChange={e=>setNghaLocations(prev=>e.target.checked?[...prev,loc]:prev.filter(l=>l!==loc))}/>
                    {loc}
                  </label>
                ))}
              </div>
            </Field>

            {/* NGHA Disclosure */}
            <div className="subsection-title">Disclosure — Relatives/Acquaintances in NGHA</div>
            <p className="section-note">Please list any relatives or acquaintances currently employed in any Ministry of National Guard Health Affairs facility.</p>
            <table className="disclosure-table">
              <thead><tr><th>#</th><th>Name</th><th>Position</th><th>Department</th><th>Relationship</th></tr></thead>
              <tbody>
                {disclosure.map((d,i)=>(
                  <tr key={i}>
                    <td>{i+1}</td>
                    <td><input className="input" value={d.name} onChange={e=>updateRow(setDisclosure,i,"name",e.target.value)}/></td>
                    <td><input className="input" value={d.position} onChange={e=>updateRow(setDisclosure,i,"position",e.target.value)}/></td>
                    <td><input className="input" value={d.department} onChange={e=>updateRow(setDisclosure,i,"department",e.target.value)}/></td>
                    <td><input className="input" value={d.relationship} onChange={e=>updateRow(setDisclosure,i,"relationship",e.target.value)}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}


        {/* ── SECTION 9: DECLARATION & SIGNATURE ── */}
        <div className="section-card">
          <SectionHeader number="9" title="Declaration &amp; Signature"/>
          <p className="section-note">By signing below, you confirm that all information provided is accurate and complete to the best of your knowledge.</p>
          <div className="form-grid-2">
            <Field label="Type your full name as signature" required>
              <input className="input" value={applicantSignature} onChange={e=>setApplicantSignature(e.target.value)} placeholder="Type your full name here"/>
              {applicantSignature && <div className="signature-preview">{applicantSignature}</div>}
            </Field>
            <Field label="Date">
              <div className="input" style={{background:"#f5f5f5",color:"#666"}}>{new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</div>
            </Field>
          </div>
        </div>

                {/* ── DOCUMENT UPLOADS ── */}
        <div className="doc-upload-section">
          <div className="doc-upload-header">
            <span className="section-number">📎</span>
            <span className="section-title" style={{color:"#fff"}}>Document Uploads</span>
          </div>
          <p className="doc-upload-note">Please upload all relevant documents to ensure your profile gets completed and processed at the earliest.</p>
          <p className="doc-upload-note">Maximum 10MB per file. Documents can be uploaded as JPG, PNG or PDF.</p>

          <div className="doc-group-title">📋 Identity Documents</div>
          <div className="doc-upload-grid">
            <InlineUpload label="Picture" accept="image/jpeg,image/png,application/pdf" value={docs.photo} onChange={v=>setDoc("photo",v)}/>
            <InlineUpload label="CNIC Copy" accept="image/jpeg,image/png,application/pdf" value={docs.cnicCopy} onChange={v=>setDoc("cnicCopy",v)}/>
            <InlineUpload label="Passport Copy" accept="image/jpeg,image/png,application/pdf" value={docs.passportCopy} onChange={v=>setDoc("passportCopy",v)}/>
            <InlineUpload label="CV" accept="image/jpeg,image/png,application/pdf" value={docs.cv} onChange={v=>setDoc("cv",v)}/>
          </div>

          <div className="doc-group-title">🎓 Education Certificates</div>
          <div className="doc-upload-grid">
            <InlineUpload label="Education 1" accept="image/jpeg,image/png,application/pdf" value={docs.eduCert1} onChange={v=>setDoc("eduCert1",v)}/>
            <InlineUpload label="Education 2" accept="image/jpeg,image/png,application/pdf" value={docs.eduCert2} onChange={v=>setDoc("eduCert2",v)}/>
            <InlineUpload label="Education 3" accept="image/jpeg,image/png,application/pdf" value={docs.eduCert3} onChange={v=>setDoc("eduCert3",v)}/>
            <InlineUpload label="Education 4" accept="image/jpeg,image/png,application/pdf" value={docs.eduCert4} onChange={v=>setDoc("eduCert4",v)}/>
            <InlineUpload label="Education 5" accept="image/jpeg,image/png,application/pdf" value={docs.eduCert5} onChange={v=>setDoc("eduCert5",v)}/>
          </div>

          <div className="doc-group-title">🏅 Training Certificates</div>
          <div className="doc-upload-grid">
            <InlineUpload label="Training 1" accept="image/jpeg,image/png,application/pdf" value={docs.trainCert1} onChange={v=>setDoc("trainCert1",v)}/>
            <InlineUpload label="Training 2" accept="image/jpeg,image/png,application/pdf" value={docs.trainCert2} onChange={v=>setDoc("trainCert2",v)}/>
            <InlineUpload label="Training 3" accept="image/jpeg,image/png,application/pdf" value={docs.trainCert3} onChange={v=>setDoc("trainCert3",v)}/>
          </div>

          <div className="doc-group-title">📜 License Documents</div>
          <div className="doc-upload-grid">
            <InlineUpload label="License 1" accept="image/jpeg,image/png,application/pdf" value={docs.license1} onChange={v=>setDoc("license1",v)}/>
            <InlineUpload label="License 2" accept="image/jpeg,image/png,application/pdf" value={docs.license2} onChange={v=>setDoc("license2",v)}/>
            <InlineUpload label="License 3" accept="image/jpeg,image/png,application/pdf" value={docs.license3} onChange={v=>setDoc("license3",v)}/>
          </div>

          <div className="doc-group-title">✅ Dataflow Report</div>
          <div className="doc-upload-grid">
            <InlineUpload label="Upload Dataflow Report" accept="image/jpeg,image/png,application/pdf" value={docs.dataflow} onChange={v=>setDoc("dataflow",v)}/>
          </div>
          <p className="doc-dataflow-note">Please upload your Dataflow primary source verification report using the button above.</p>

          <div className="doc-group-title">💼 Experience Certificates</div>
          <div className="doc-upload-grid">
            <InlineUpload label="Experience 1" accept="image/jpeg,image/png,application/pdf" value={docs.expCert1} onChange={v=>setDoc("expCert1",v)}/>
            <InlineUpload label="Experience 2" accept="image/jpeg,image/png,application/pdf" value={docs.expCert2} onChange={v=>setDoc("expCert2",v)}/>
            <InlineUpload label="Experience 3" accept="image/jpeg,image/png,application/pdf" value={docs.expCert3} onChange={v=>setDoc("expCert3",v)}/>
            <InlineUpload label="Experience 4" accept="image/jpeg,image/png,application/pdf" value={docs.expCert4} onChange={v=>setDoc("expCert4",v)}/>
            <InlineUpload label="Experience 5" accept="image/jpeg,image/png,application/pdf" value={docs.expCert5} onChange={v=>setDoc("expCert5",v)}/>
            <InlineUpload label="Experience 6" accept="image/jpeg,image/png,application/pdf" value={docs.expCert6} onChange={v=>setDoc("expCert6",v)}/>
            <InlineUpload label="Experience 7" accept="image/jpeg,image/png,application/pdf" value={docs.expCert7} onChange={v=>setDoc("expCert7",v)}/>
          </div>
        </div>

        <div className="submit-section">
          <p className="submit-note">By submitting this form you confirm that all information provided is accurate and complete.</p>
          <button type="submit" className="btn-submit">Submit Application →</button>
        </div>

      </form>

      <footer className="form-footer">
        <p>Al Najam International &nbsp;|&nbsp; License # 0899/LHR &nbsp;|&nbsp; Human Resource Providers Since 1971</p>
        <p>+92 300 4747 115 &nbsp;|&nbsp; support@alnajam.com &nbsp;|&nbsp; www.alnajam.com</p>
      </footer>
    </div>
  );
}
