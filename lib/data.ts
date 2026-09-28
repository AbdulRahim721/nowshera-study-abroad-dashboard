export type Student = { id: string; name: string; phone: string; country: string; marks: number; ielts: number | null; budget: string; status: 'new'|'active'|'waiting'|'completed'; lastReply: string };
export type University = { id: string; university: string; country: string; program: string; fee: string; deadline: string; minMarks: number; minIelts: number; documents: string };
export type DocumentRecord = { id: string; student: string; type: string; status: 'approved'|'pending'|'problem'; issue: string; uploaded: string };
export type Message = { id: string; student: string; sender: 'student'|'ai'|'staff'; message: string; approvalStatus: 'pending'|'approved'|'rejected'|'sent'; created: string };

export const students: Student[] = [
  { id:'s1', name:'Ali Khan', phone:'0301 2345678', country:'UK', marks:78, ielts:6.5, budget:'£35,000', status:'active', lastReply:'Today' },
  { id:'s2', name:'Ayesha Noor', phone:'0333 9876543', country:'Canada', marks:85, ielts:7, budget:'CAD 65,000', status:'active', lastReply:'Today' },
  { id:'s3', name:'Hamza Iqbal', phone:'0346 2223344', country:'UK', marks:69, ielts:null, budget:'£25,000', status:'waiting', lastReply:'4 days ago' },
];
export const universities: University[] = [
  {id:'u1',university:'University of Manchester',country:'UK',program:'BSc Computer Science',fee:'£32,000/year',deadline:'15 Jan 2027',minMarks:75,minIelts:6.5,documents:'Passport, transcript, IELTS'},
  {id:'u2',university:'University of Leeds',country:'UK',program:'BSc Business Management',fee:'£27,000/year',deadline:'31 Jan 2027',minMarks:70,minIelts:6.5,documents:'Passport, transcript, IELTS, personal statement'},
  {id:'u3',university:'University of Toronto',country:'Canada',program:'BSc Computer Science',fee:'CAD 60,000/year',deadline:'15 Jan 2027',minMarks:80,minIelts:6.5,documents:'Passport, transcript, IELTS'},
  {id:'u4',university:'TU Munich',country:'Germany',program:'BSc Informatics',fee:'No tuition (about €150 a term)',deadline:'15 Jul 2027',minMarks:70,minIelts:6.5,documents:'Passport, transcript, IELTS'},
  {id:'u5',university:'Monash University',country:'Australia',program:'Bachelor of IT',fee:'AUD 48,000/year',deadline:'30 Nov 2026',minMarks:70,minIelts:6,documents:'Passport, transcript, IELTS'},
  {id:'u6',university:'University of Birmingham',country:'UK',program:'BSc Data Science',fee:'£29,000/year',deadline:'25 Jan 2027',minMarks:72,minIelts:6.5,documents:'Passport, transcript, IELTS'},
  {id:'u7',university:'University of British Columbia',country:'Canada',program:'BSc Information Technology',fee:'CAD 55,000/year',deadline:'15 Jan 2027',minMarks:78,minIelts:6.5,documents:'Passport, transcript, IELTS'},
  {id:'u8',university:'University of Melbourne',country:'Australia',program:'Bachelor of Commerce',fee:'AUD 45,000/year',deadline:'31 Oct 2026',minMarks:75,minIelts:6.5,documents:'Passport, transcript, IELTS'},
  {id:'u9',university:'RWTH Aachen',country:'Germany',program:'BSc Mechanical Engineering',fee:'No tuition (about €300 a term)',deadline:'15 Jul 2027',minMarks:72,minIelts:6.5,documents:'Passport, transcript, IELTS'},
  {id:'u10',university:'University of Glasgow',country:'UK',program:'BSc Artificial Intelligence',fee:'£31,000/year',deadline:'30 Jan 2027',minMarks:76,minIelts:6.5,documents:'Passport, transcript, IELTS'},
  {id:'u11',university:'McGill University',country:'Canada',program:'BSc Software Engineering',fee:'CAD 52,000/year',deadline:'15 Jan 2027',minMarks:82,minIelts:7,documents:'Passport, transcript, IELTS'},
  {id:'u12',university:'University of Sydney',country:'Australia',program:'Bachelor of Design Computing',fee:'AUD 49,000/year',deadline:'30 Nov 2026',minMarks:70,minIelts:6.5,documents:'Passport, transcript, IELTS'},
  {id:'u13',university:'University of Bonn',country:'Germany',program:'BSc Computer Science',fee:'No tuition (about €320 a term)',deadline:'15 Jul 2027',minMarks:70,minIelts:6.5,documents:'Passport, transcript, IELTS'},
  {id:'u14',university:'University of Waterloo',country:'Canada',program:'BSc Mathematics',fee:'CAD 48,000/year',deadline:'1 Feb 2027',minMarks:80,minIelts:6.5,documents:'Passport, transcript, IELTS'},
  {id:'u15',university:'Queensland University of Technology',country:'Australia',program:'Bachelor of Business',fee:'AUD 40,000/year',deadline:'30 Nov 2026',minMarks:68,minIelts:6,documents:'Passport, transcript, IELTS'},
];
export const documents: DocumentRecord[] = [
  {id:'d1',student:'Ali Khan',type:'Passport (test)',status:'approved',issue:'',uploaded:'28 Sep 2026'},
  {id:'d2',student:'Ayesha Noor',type:'Academic transcript (test)',status:'pending',issue:'Awaiting staff review',uploaded:'27 Sep 2026'},
  {id:'d3',student:'Hamza Iqbal',type:'IELTS certificate (test)',status:'problem',issue:'IELTS not taken yet',uploaded:'24 Sep 2026'},
];
export const messages: Message[] = [
  {id:'6aba4fbc3b1222cd69d359c9',student:'Hamza Iqbal',sender:'ai',message:'Assalam-o-alaikum Hamza, aap ka follow-up due hai. Kya aap apne IELTS test ki date confirm kar sakte hain?',approvalStatus:'pending',created:'4 days ago'},
  {id:'m2',student:'Ali Khan',sender:'staff',message:'Your Manchester shortlist is ready for review.',approvalStatus:'approved',created:'Yesterday'},
  {id:'m3',student:'Ayesha Noor',sender:'ai',message:'We found three Canadian programs matching your profile.',approvalStatus:'sent',created:'Yesterday'},
];
export const activities = [
  {text:'New transcript uploaded for Ayesha Noor',time:'18 min ago',tone:'teal'},
  {text:'Hamza Iqbal follow-up is waiting for approval',time:'1 hr ago',tone:'amber'},
  {text:'Ali Khan shortlisted for UK programs',time:'Yesterday',tone:'blue'},
];
