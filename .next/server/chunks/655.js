"use strict";exports.id=655,exports.ids=[655],exports.modules={3655:(e,t,i)=>{i.d(t,{BioethicsFramework:()=>n,ComplianceDashboard:()=>a,FDAComplianceChecker:()=>s});class s{static{this.FDA_REQUIREMENTS=[{id:"fda-001",category:"fda",requirement:"No medical claims without FDA approval",status:"compliant",evidence:["AI responses include medical disclaimers"],lastReview:new Date().toISOString(),nextReview:new Date(Date.now()+7776e6).toISOString(),severity:"critical"},{id:"fda-002",category:"fda",requirement:"Dietary supplement claims compliance (DSHEA)",status:"compliant",evidence:["Structure/function claims include required disclaimers"],lastReview:new Date().toISOString(),nextReview:new Date(Date.now()+7776e6).toISOString(),severity:"high"},{id:"fda-003",category:"fda",requirement:"Food safety information accuracy",status:"compliant",evidence:["All food safety advice includes expert consultation warnings"],lastReview:new Date().toISOString(),nextReview:new Date(Date.now()+2592e6).toISOString(),severity:"critical"},{id:"fda-004",category:"fda",requirement:"GRAS (Generally Recognized as Safe) substance guidelines",status:"under-review",evidence:["Database includes GRAS status for known compounds"],lastReview:new Date().toISOString(),nextReview:new Date(Date.now()+5184e6).toISOString(),severity:"medium"}]}static async assessContent(e,t){let i=[],s=e.toLowerCase(),n=["cures","treats","prevents","diagnoses","heals","therapy","medicine","drug","pharmaceutical","clinical trial"],a=n.some(e=>s.includes(e)),o=["not fda approved","consult physician","medical professional","not intended to diagnose","research purposes"].some(e=>s.includes(e));a&&!o&&i.push({id:"fda-violation-001",category:"fda",requirement:"Medical claims require FDA disclaimer",status:"non-compliant",evidence:[`Content contains medical claims: ${n.filter(e=>s.includes(e)).join(", ")}`],lastReview:new Date().toISOString(),nextReview:new Date().toISOString(),severity:"critical"});let r=["edible","safe to eat","non-toxic","food grade"].some(e=>s.includes(e)),c=["proper identification","expert identification","certain identification","consult expert","professional mycologist"].some(e=>s.includes(e));return r&&!c&&i.push({id:"fda-violation-002",category:"safety",requirement:"Food safety claims require identification warnings",status:"non-compliant",evidence:["Content contains food safety claims without proper warnings"],lastReview:new Date().toISOString(),nextReview:new Date().toISOString(),severity:"critical"}),i}static getComplianceStatus(){return this.FDA_REQUIREMENTS}static async generateComplianceReport(){let e=this.getComplianceStatus(),t=e.filter(e=>"compliant"===e.status).length,i=e.length;return`
# FDA Compliance Report - Crowe Logic AI

## Overall Status: ${t}/${i} Requirements Met

### Critical Requirements
${e.filter(e=>"critical"===e.severity).map(e=>`- ${e.requirement}: ${"compliant"===e.status?"✅":"❌"} ${e.status}`).join("\n")}

### All Requirements Status
${e.map(e=>`- **${e.id}**: ${e.requirement}
  - Status: ${e.status}
  - Severity: ${e.severity}
  - Last Review: ${new Date(e.lastReview).toLocaleDateString()}
  - Next Review: ${new Date(e.nextReview).toLocaleDateString()}
`).join("\n")}

### Recommendations
- Implement automated content scanning for medical claims
- Regular review cycles for food safety information
- Legal review of all health-related content
- Expert mycologist validation of species information
    `}}class n{static async assessResearchEthics(e,t,i,s){return{studyId:`ethics-${Date.now()}`,principlesBased:{autonomy:this.assessAutonomy(i,t),beneficence:this.assessBeneficence(e,s),nonMaleficence:this.assessNonMaleficence(e,t),justice:this.assessJustice(s,t)},riskAssessment:this.assessRisk(e,t),consentRequirements:this.determineConsentRequirements(t,s),oversightLevel:this.determineOversightLevel(e,t)}}static assessAutonomy(e,t){let i=e?80:20,s=["Informed consent process","Right to withdraw","Data ownership clarity"],n=[];return e||(n.push("Implement comprehensive consent process"),i=20),t.includes("personal")&&(s.push("Explicit consent for personal data"),e||(i-=20)),{score:Math.max(0,i),rationale:e?"User consent obtained":"Missing user consent",requirements:s,mitigations:n}}static assessBeneficence(e,t){let i=70,s=["Research benefits scientific community","Advancement of mycological knowledge","Open access to findings"],n=[];return"commercial-product-development"===e&&(i=t?50:70,s.push("Balance commercial and public benefit")),t&&(s.push("Ensure public benefit alongside commercial gain"),n.push("Consider open-source components")),{score:i,rationale:"Research provides scientific and educational benefits",requirements:s,mitigations:n}}static assessNonMaleficence(e,t){let i=90,s=["No harmful advice generation","Safety warnings for toxic species","Data protection measures"],n=[];return t.includes("location")&&(i-=10,s.push("Location data anonymization"),n.push("Implement location privacy controls")),e.includes("identification")&&(s.push("Clear safety disclaimers for species identification"),s.push("Expert validation requirements")),{score:i,rationale:"Low risk research with appropriate safeguards",requirements:s,mitigations:n}}static assessJustice(e,t){let i=["Equitable access to research benefits","Fair representation in data collection","No exploitation of vulnerable populations"],s=[];return e&&(i.push("Benefit sharing with research participants"),s.push("Implement regenerative dividend pool"),s.push("Ensure affordable access to platform")),{score:e?60:80,rationale:e?"Commercial use requires additional justice considerations":"Research-focused approach promotes justice",requirements:i,mitigations:s}}static assessRisk(e,t){return t.includes("genetic")||t.includes("health")?"greater-than-minimal":t.includes("location")||t.includes("personal")?"minor-increase":"minimal"}static determineConsentRequirements(e,t){let i=[{type:"informed-consent",required:!0,template:"basic-research-consent",customizations:["Study purpose","Data usage","Withdrawal rights"]},{type:"data-usage",required:!0,template:"data-usage-consent",customizations:e.map(e=>`${e} data usage`)}];return t&&i.push({type:"publication",required:!0,template:"commercial-publication-consent",customizations:["Commercial use disclosure","Benefit sharing"]}),i}static determineOversightLevel(e,t){return t.includes("genetic")||t.includes("health")?"full-review":t.includes("personal")||e.includes("intervention")?"expedited":"none"}static generateEthicsReport(e){let t=Object.values(e.principlesBased).reduce((e,t)=>e+t.score,0)/4;return`
# Bioethics Assessment Report

## Study ID: ${e.studyId}
## Overall Ethics Score: ${t.toFixed(1)}/100

### Principle-Based Assessment

#### Autonomy: ${e.principlesBased.autonomy.score}/100
- **Rationale**: ${e.principlesBased.autonomy.rationale}
- **Requirements**: ${e.principlesBased.autonomy.requirements.join(", ")}
- **Mitigations**: ${e.principlesBased.autonomy.mitigations.join(", ")||"None required"}

#### Beneficence: ${e.principlesBased.beneficence.score}/100
- **Rationale**: ${e.principlesBased.beneficence.rationale}
- **Requirements**: ${e.principlesBased.beneficence.requirements.join(", ")}

#### Non-Maleficence: ${e.principlesBased.nonMaleficence.score}/100
- **Rationale**: ${e.principlesBased.nonMaleficence.rationale}
- **Requirements**: ${e.principlesBased.nonMaleficence.requirements.join(", ")}

#### Justice: ${e.principlesBased.justice.score}/100
- **Rationale**: ${e.principlesBased.justice.rationale}
- **Requirements**: ${e.principlesBased.justice.requirements.join(", ")}

### Risk Assessment: ${e.riskAssessment.toUpperCase()}
### Required Oversight Level: ${e.oversightLevel.toUpperCase()}

### Consent Requirements
${e.consentRequirements.map(e=>`- **${e.type}**: ${e.required?"REQUIRED":"Optional"}`).join("\n")}

### Recommendations
${t>=80?"✅ Ethics approval recommended":t>=60?"⚠️ Ethics approval with conditions":"❌ Ethics concerns require resolution"}
    `}}class a{static async generateFullReport(){let e=await s.generateComplianceReport(),t=await n.assessResearchEthics("mycology-research-platform",["usage-data","research-queries"],!0,!0),i=n.generateEthicsReport(t);return`
# Crowe Logic AI - Comprehensive Compliance Report
Generated: ${new Date().toISOString()}

${e}

---

${i}

---

## Overall Compliance Status
- **FDA Compliance**: Under continuous review
- **Bioethics Compliance**: Approved with monitoring
- **Next Review**: ${new Date(Date.now()+2592e6).toLocaleDateString()}

## Action Items
1. Implement automated content scanning for compliance violations
2. Establish ethics review board for platform changes
3. Regular training for AI model bias detection
4. Quarterly compliance audits
    `}}}};