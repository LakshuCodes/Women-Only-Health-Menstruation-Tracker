import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Animated, Dimensions, StatusBar,
  Modal, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Path, Line, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

let AsyncStorage = null;
try { AsyncStorage = require('@react-native-async-storage/async-storage').default; } catch(e) {}

const { width } = Dimensions.get('window');
const Ico = ({ name, size = 20, color = '#E8748A' }) => <Ionicons name={name} size={size} color={color} />;

// ── PALETTE — soft, airy, muted rose (matching image 2) ──
const C = {
  bg:          '#FDF0F3',   // very light blush background
  card:        '#FFFFFF',   // pure white cards
  rose:        '#E8748A',   // muted rose — primary (softer than #FB6F92)
  roseDark:    '#C95470',   // darker rose for text accents
  roseLight:   '#F5A8B8',   // light rose
  roseFog:     '#FAD4DC',   // foggy rose — borders, dividers
  roseMist:    '#FDE8ED',   // misty rose — card bg tints
  roseCircle:  '#FADADF',   // nav active circle bg
  purple:      '#A78FD0',   // soft purple
  purpleMist:  '#EDE7F6',
  green:       '#5BBF87',
  text:        '#2C1A20',   // dark warm charcoal
  sub:         '#8F6470',   // muted warm brown
  faint:       '#BFA0AA',   // very faint for inactive nav
  white:       '#FFFFFF',
};

// ── Live date/greeting ──
const getLiveDate = () => {
  const now  = new Date();
  const DAYS = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
  const MONS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  return `${DAYS[now.getDay()]}, ${MONS[now.getMonth()]} ${now.getDate()}`;
};
const getGreeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

const CYCLE_DAY   = 14;
const CYCLE_TOTAL = 28;

// ── Telegram-style mood personalities ──
const MOODS = [
  { emoji:'😢', label:'Sad',
    animate:(sc,ty,rot)=>{ Animated.sequence([Animated.parallel([Animated.spring(sc,{toValue:1.55,useNativeDriver:true,friction:5,tension:100}),Animated.timing(ty,{toValue:-5,useNativeDriver:true,duration:250}),Animated.timing(rot,{toValue:-0.4,useNativeDriver:true,duration:250})]),Animated.timing(rot,{toValue:0.3,useNativeDriver:true,duration:150}),Animated.timing(rot,{toValue:-0.2,useNativeDriver:true,duration:130}),Animated.parallel([Animated.timing(ty,{toValue:5,useNativeDriver:true,duration:350}),Animated.timing(rot,{toValue:-0.1,useNativeDriver:true,duration:350})]),Animated.parallel([Animated.spring(sc,{toValue:1.2,useNativeDriver:true,friction:6}),Animated.spring(ty,{toValue:0,useNativeDriver:true,friction:6}),Animated.spring(rot,{toValue:0,useNativeDriver:true,friction:6})])]).start(); }},
  { emoji:'😕', label:'Down',
    animate:(sc,ty,rot)=>{ Animated.sequence([Animated.parallel([Animated.spring(sc,{toValue:1.5,useNativeDriver:true,friction:5,tension:120}),Animated.timing(ty,{toValue:-12,useNativeDriver:true,duration:320}),Animated.timing(rot,{toValue:0.25,useNativeDriver:true,duration:320})]),Animated.parallel([Animated.timing(ty,{toValue:7,useNativeDriver:true,duration:450}),Animated.timing(rot,{toValue:-0.15,useNativeDriver:true,duration:450})]),Animated.parallel([Animated.spring(sc,{toValue:1.2,useNativeDriver:true,friction:6}),Animated.spring(ty,{toValue:0,useNativeDriver:true,friction:6}),Animated.spring(rot,{toValue:0,useNativeDriver:true,friction:6})])]).start(); }},
  { emoji:'😐', label:'Neutral',
    animate:(sc,ty,rot)=>{ Animated.sequence([Animated.spring(sc,{toValue:1.5,useNativeDriver:true,friction:4,tension:180}),Animated.timing(rot,{toValue:0.45,useNativeDriver:true,duration:130}),Animated.timing(rot,{toValue:-0.45,useNativeDriver:true,duration:130}),Animated.timing(rot,{toValue:0.35,useNativeDriver:true,duration:120}),Animated.timing(rot,{toValue:-0.35,useNativeDriver:true,duration:120}),Animated.timing(rot,{toValue:0.15,useNativeDriver:true,duration:100}),Animated.timing(rot,{toValue:-0.15,useNativeDriver:true,duration:100}),Animated.parallel([Animated.spring(sc,{toValue:1.2,useNativeDriver:true,friction:6}),Animated.spring(rot,{toValue:0,useNativeDriver:true,friction:6})])]).start(); }},
  { emoji:'😊', label:'Good',
    animate:(sc,ty,rot)=>{ Animated.sequence([Animated.parallel([Animated.spring(sc,{toValue:1.75,useNativeDriver:true,friction:3,tension:280}),Animated.timing(ty,{toValue:-20,useNativeDriver:true,duration:200}),Animated.timing(rot,{toValue:0.55,useNativeDriver:true,duration:140})]),Animated.parallel([Animated.timing(rot,{toValue:-0.55,useNativeDriver:true,duration:130}),Animated.spring(ty,{toValue:-10,useNativeDriver:true,friction:5})]),Animated.parallel([Animated.spring(sc,{toValue:1.3,useNativeDriver:true,friction:4}),Animated.spring(ty,{toValue:0,useNativeDriver:true,friction:5}),Animated.spring(rot,{toValue:0,useNativeDriver:true,friction:5})])]).start(); }},
  { emoji:'😄', label:'Great',
    animate:(sc,ty,rot)=>{ Animated.sequence([Animated.parallel([Animated.spring(sc,{toValue:2.1,useNativeDriver:true,friction:2,tension:450}),Animated.timing(ty,{toValue:-28,useNativeDriver:true,duration:160}),Animated.timing(rot,{toValue:1,useNativeDriver:true,duration:160})]),Animated.timing(rot,{toValue:-1,useNativeDriver:true,duration:150}),Animated.timing(ty,{toValue:-24,useNativeDriver:true,duration:80}),Animated.timing(rot,{toValue:1,useNativeDriver:true,duration:130}),Animated.parallel([Animated.spring(sc,{toValue:1.4,useNativeDriver:true,friction:3}),Animated.timing(rot,{toValue:0,useNativeDriver:true,duration:120}),Animated.spring(ty,{toValue:0,useNativeDriver:true,friction:4})]),Animated.spring(sc,{toValue:1.2,useNativeDriver:true,friction:6})]).start(); }},
];

const EXERCISE_MODULES = [
  { id:'1', title:'Period Relief',    subtitle:'Ease cramps & bloating',     icon:'water',        bg:'#FFF0F3', accent:'#E8748A', videoCount:8,  searchQuery:'period cramps relief yoga exercises' },
  { id:'2', title:'PCOS & PCOD Yoga', subtitle:'Balance hormones naturally', icon:'body',         bg:'#F3EEF9', accent:'#A78FD0', videoCount:12, searchQuery:'PCOS PCOD yoga workout exercises' },
  { id:'3', title:'Pregnancy Safe',   subtitle:'Gentle prenatal workouts',   icon:'heart-circle', bg:'#EDFBF3', accent:'#5BBF87', videoCount:10, searchQuery:'pregnancy safe prenatal yoga exercises' },
];

// ── SVG Nav Icons ──
const DashboardIcon = ({ color, size=26 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="7" height="7" rx="2" fill={color}/>
    <Rect x="14" y="3" width="7" height="7" rx="2" fill={color}/>
    <Rect x="3" y="14" width="7" height="7" rx="2" fill={color}/>
    <Rect x="14" y="14" width="7" height="7" rx="2" fill={color}/>
  </Svg>
);
const CalendarNavIcon = ({ color, size=26 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="5" width="18" height="16" rx="2" stroke={color} strokeWidth="2"/>
    <Line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="2"/>
    <Line x1="8" y1="3" x2="8" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <Line x1="16" y1="3" x2="16" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <Rect x="7" y="13" width="3" height="3" rx="0.5" fill={color}/>
    <Rect x="11" y="13" width="3" height="3" rx="0.5" fill={color}/>
  </Svg>
);
const DoctorNavIcon = ({ color, size=26 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="3" width="16" height="18" rx="2" stroke={color} strokeWidth="2"/>
    <Line x1="12" y1="8" x2="12" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <Line x1="9" y1="11" x2="15" y2="11" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);
const SocialNavIcon = ({ color, size=26 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Line x1="8" y1="9" x2="16" y2="9" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <Line x1="8" y1="13" x2="13" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </Svg>
);
const ShopNavIcon = ({ color, size=26 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <Path d="M16 10a4 4 0 01-8 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const BellSvg = ({ color, size=22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const WaterSvg = ({ color, size=22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C12 2 5 10 5 15a7 7 0 0 0 14 0C19 10 12 2 12 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={color+'33'}/>
  </Svg>
);
const MoonSvg = ({ color, size=22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={color+'22'}/>
  </Svg>
);
const ChatBubbleHeart = ({ size=44 }) => (
  <Svg width={size} height={size*0.88} viewBox="0 0 120 106" fill="none">
    <Path d="M60 4 C28 4, 4 22, 4 46 C4 67, 24 82, 50 85 C52 85, 53 88, 52 98 C52 100, 54 101, 55 99 C62 90, 68 87, 72 85 C97 82, 116 66, 116 46 C116 22, 92 4, 60 4 Z" fill="#E8748A"/>
    <Path d="M30 14 C38 10, 50 8, 62 9 C74 10, 84 14, 88 20 C80 16, 68 13, 56 13 C44 13, 34 16, 30 14 Z" fill="rgba(255,255,255,0.35)"/>
    <Path d="M60 68 C60 68, 36 54, 36 40 C36 32, 42 26, 50 28 C54 29, 58 32, 60 36 C62 32, 66 29, 70 28 C78 26, 84 32, 84 40 C84 54, 60 68, 60 68 Z" fill="rgba(255,210,220,0.85)"/>
    <Path d="M60 62 C60 62, 42 50, 42 40 C42 35, 46 31, 51 33 C55 34, 58 37, 60 40 C62 37, 65 34, 69 33 C74 31, 78 35, 78 40 C78 50, 60 62, 60 62 Z" fill="rgba(255,235,240,0.6)"/>
  </Svg>
);

const NAV_TABS = [
  { key:'Dashboard', label:'Dashboard', Icon:DashboardIcon },
  { key:'Calendar',  label:'Calendar',  Icon:CalendarNavIcon },
  { key:'Doctor',    label:'Doctor',    Icon:DoctorNavIcon },
  { key:'Social',    label:'Social',    Icon:SocialNavIcon },
  { key:'Shop',      label:'Shop',      Icon:ShopNavIcon },
];

// ── Shared stores ──
let _reminders = [
  { id:'1', icon:'medical', title:'Iron Supplement', time:'8:00 AM',  color:'#FAD4DC' },
  { id:'2', icon:'pulse',   title:'Dr. Appointment', time:'Tomorrow', color:'#F5E6FA' },
  { id:'3', icon:'walk',    title:'Evening Walk',    time:'6:00 PM',  color:'#D4EEF0' },
];
let _rL = [];
export const getReminders       = () => _reminders;
export const setReminders       = (r) => { _reminders = r; _rL.forEach(f=>f(r)); };
export const subscribeReminders = (fn) => { _rL.push(fn); return ()=>{ _rL=_rL.filter(f=>f!==fn); }; };
let _uN = 'Maya', _uL = [];
export const getUserName        = () => _uN;
export const setUserName        = (n) => { _uN = n; _uL.forEach(f=>f(n)); };
export const subscribeUserName  = (fn) => { _uL.push(fn); return ()=>{ _uL=_uL.filter(f=>f!==fn); }; };

// ═══════════════════════════════════════════════════
// HOME SCREEN
// ═══════════════════════════════════════════════════
export default function HomeScreen({ navigation, route }) {

  const [liveDate,  setLiveDate]  = useState(getLiveDate());
  const [liveGreet, setLiveGreet] = useState(getGreeting());
  useEffect(() => {
    const id = setInterval(()=>{ setLiveDate(getLiveDate()); setLiveGreet(getGreeting()); }, 60000);
    return ()=>clearInterval(id);
  }, []);

  // Animations
  const fadeA   = useRef(new Animated.Value(0)).current;
  const slideA  = useRef(new Animated.Value(24)).current;
  const ringA   = useRef(new Animated.Value(0)).current;
  const botP    = useRef(new Animated.Value(1)).current;
  const rip1    = useRef(new Animated.Value(1)).current;
  const rip2    = useRef(new Animated.Value(1)).current;
  const wigA    = useRef(new Animated.Value(0)).current;
  const floatA  = useRef(new Animated.Value(0)).current;

  const [activeTab, setActiveTab] = useState('Dashboard');

  // Mood
  const [sel, setSel] = useState(3);
  const mSc  = useRef(MOODS.map(()=>new Animated.Value(1))).current;
  const mTY  = useRef(MOODS.map(()=>new Animated.Value(0))).current;
  const mRot = useRef(MOODS.map(()=>new Animated.Value(0))).current;
  const bigSc = useRef(new Animated.Value(1)).current;
  const lbOp  = useRef(new Animated.Value(1)).current;
  const lbTY  = useRef(new Animated.Value(0)).current;
  const bstSc = useRef(new Animated.Value(0.5)).current;
  const bstOp = useRef(new Animated.Value(0)).current;

  const triggerMood = useCallback((idx)=>{
    MOODS.forEach((_,i)=>{ if(i!==idx){ Animated.parallel([Animated.spring(mSc[i],{toValue:1,useNativeDriver:true,friction:8}),Animated.spring(mTY[i],{toValue:0,useNativeDriver:true,friction:8}),Animated.spring(mRot[i],{toValue:0,useNativeDriver:true,friction:8})]).start(); } });
    bstSc.setValue(0.4); bstOp.setValue(0.8);
    Animated.parallel([Animated.timing(bstSc,{toValue:2.4,duration:480,useNativeDriver:true}),Animated.timing(bstOp,{toValue:0,duration:480,useNativeDriver:true})]).start();
    MOODS[idx].animate(mSc[idx], mTY[idx], mRot[idx]);
    const pts=[1.1,1.18,1.22,1.35,1.55];
    Animated.sequence([Animated.spring(bigSc,{toValue:pts[idx],useNativeDriver:true,friction:3,tension:280}),Animated.spring(bigSc,{toValue:0.9,useNativeDriver:true,friction:4}),Animated.spring(bigSc,{toValue:1,useNativeDriver:true,friction:6})]).start();
    Animated.sequence([Animated.parallel([Animated.timing(lbOp,{toValue:0,duration:80,useNativeDriver:true}),Animated.timing(lbTY,{toValue:8,duration:80,useNativeDriver:true})]),Animated.parallel([Animated.timing(lbOp,{toValue:1,duration:200,useNativeDriver:true}),Animated.spring(lbTY,{toValue:0,useNativeDriver:true,friction:5})])]).start();
  },[]);

  // Data
  const [reminders, setLR] = useState(_reminders);
  const [userName,  setLU] = useState(_uN);
  const WGOAL=10, GML=250, SGOAL=8;
  const [wG, setWG] = useState(0);
  const [sH, setSH] = useState(7);
  const [sM, setSM] = useState(0);
  const [showW, setShowW] = useState(false);
  const [showS, setShowS] = useState(false);
  const [sIH, setSIH] = useState('7');
  const [sIM, setSIM] = useState('0');
  const [wTab, setWTab] = useState('today');
  const [sTab, setSTab] = useState('today');
  const [wHist, setWHist] = useState([]);
  const [sHist, setSHist] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const tKey = ()=>{ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  const dAgo = (n)=>{ const d=new Date(); d.setDate(d.getDate()-n); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  const getDL = (dk)=>{ if(!dk)return''; if(dk===tKey())return'Today'; if(dk===dAgo(1))return'Yesterday'; const[y,mo,dy]=dk.split('-').map(Number); return new Date(y,mo-1,dy).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'}); };
  const WS='OVIA_WATER_V1', SS='OVIA_SLEEP_V1';
  const buildH=(wd,sd)=>{ const t=tKey(); setWHist(Object.keys(wd).filter(k=>k!==t).sort((a,b)=>b.localeCompare(a)).map(k=>({dateKey:k,glasses:wd[k]}))); setSHist(Object.keys(sd).filter(k=>k!==t).sort((a,b)=>b.localeCompare(a)).map(k=>({dateKey:k,h:sd[k].h,m:sd[k].m}))); };

  useEffect(()=>{ if(!AsyncStorage){setLoaded(true);return;} (async()=>{ try{ const[wr,sr]=await Promise.all([AsyncStorage.getItem(WS),AsyncStorage.getItem(SS)]); const wd=wr?JSON.parse(wr):{}; const sd=sr?JSON.parse(sr):{}; const t=tKey(); if(wd[t]!==undefined)setWG(wd[t]); if(sd[t]!==undefined){setSH(sd[t].h);setSM(sd[t].m);setSIH(String(sd[t].h));setSIM(String(sd[t].m));} buildH(wd,sd); }catch(e){} setLoaded(true); })(); },[]);
  useEffect(()=>{ if(!loaded||!AsyncStorage)return; (async()=>{ try{ const r=await AsyncStorage.getItem(WS); const d=r?JSON.parse(r):{}; d[tKey()]=wG; await AsyncStorage.setItem(WS,JSON.stringify(d)); const sr=await AsyncStorage.getItem(SS); buildH(d,sr?JSON.parse(sr):{}); }catch(e){} })(); },[wG,loaded]);
  useEffect(()=>{ if(!loaded||!AsyncStorage)return; (async()=>{ try{ const r=await AsyncStorage.getItem(SS); const d=r?JSON.parse(r):{}; d[tKey()]={h:sH,m:sM}; await AsyncStorage.setItem(SS,JSON.stringify(d)); const wr=await AsyncStorage.getItem(WS); buildH(wr?JSON.parse(wr):{},d); }catch(e){} })(); },[sH,sM,loaded]);

  const wL=(wG*GML/1000).toFixed(1), wP=Math.min(Math.round((wG/WGOAL)*100),100);
  const sTM=sH*60+sM, sP=Math.min(Math.round((sTM/(SGOAL*60))*100),100);
  const sDisp=sM>0?`${sH}h ${String(sM).padStart(2,'0')}m`:`${sH}h`;
  const saveSleep=()=>{ const h=Math.min(Math.max(parseInt(sIH)||0,0),23); const m=Math.min(Math.max(parseInt(sIM)||0,0),59); setSH(h);setSM(m);setShowS(false); };

  // Entry animations
  useEffect(()=>{
    Animated.parallel([Animated.timing(fadeA,{toValue:1,duration:700,useNativeDriver:true}),Animated.timing(slideA,{toValue:0,duration:600,useNativeDriver:true})]).start();
    Animated.timing(ringA,{toValue:1,duration:1400,delay:300,useNativeDriver:false}).start();
    Animated.loop(Animated.sequence([Animated.timing(botP,{toValue:1.07,duration:1600,useNativeDriver:true}),Animated.timing(botP,{toValue:1,duration:1600,useNativeDriver:true})])).start();
    const sr=(a,dl,to,dur)=>Animated.loop(Animated.sequence([Animated.delay(dl),Animated.timing(a,{toValue:to,duration:dur,useNativeDriver:true}),Animated.timing(a,{toValue:1,duration:0,useNativeDriver:true})])).start();
    sr(rip1,0,1.6,1800); sr(rip2,800,1.9,1800);
    const wg=()=>Animated.sequence([Animated.delay(3500),Animated.timing(wigA,{toValue:1,duration:100,useNativeDriver:true}),Animated.timing(wigA,{toValue:-1,duration:100,useNativeDriver:true}),Animated.timing(wigA,{toValue:1,duration:100,useNativeDriver:true}),Animated.timing(wigA,{toValue:0,duration:100,useNativeDriver:true})]).start(wg);
    wg();
    Animated.loop(Animated.sequence([Animated.timing(floatA,{toValue:-6,duration:1400,useNativeDriver:true}),Animated.timing(floatA,{toValue:0,duration:1400,useNativeDriver:true})])).start();
    const ur=subscribeReminders(r=>setLR([...r]));
    const uu=subscribeUserName(n=>setLU(n));
    return()=>{ ur(); uu(); };
  },[]);
  useEffect(()=>{ setLU(getUserName()); },[route]);

  const cp=(CYCLE_DAY/CYCLE_TOTAL)*100;
  const mood=MOODS[sel];
  const fn=userName.split(' ')[0]||userName;
  const ini=userName.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);

  return (
    <SafeAreaView style={S.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg}/>
      <ScrollView style={S.scroll} contentContainerStyle={S.content} showsVerticalScrollIndicator={false}>

        {/* ── decorative blob ── */}
        <View style={S.blob1}/>
        <View style={S.blob2}/>

        {/* ════════ TOP BAR ════════ */}
        <Animated.View style={[S.topBar,{opacity:fadeA}]}>
          <View style={S.avatarRow}>
            <TouchableOpacity style={S.avatar} onPress={()=>navigation.navigate('Profile')} activeOpacity={0.85}>
              <Text style={S.avatarTxt}>{ini}</Text>
              <View style={S.onlineDot}/>
            </TouchableOpacity>
            <View style={{gap:2}}>
              <Text style={S.greeting}>{liveGreet}, {fn}</Text>
              <Text style={S.dateTxt}>{liveDate}</Text>
            </View>
          </View>
          <TouchableOpacity style={S.bellBtn} onPress={()=>navigation.navigate('Notifications')} activeOpacity={0.8}>
            <BellSvg color={C.rose} size={20}/>
            <View style={S.bellDot}/>
          </TouchableOpacity>
        </Animated.View>

        {/* ════════ CYCLE HERO CARD ════════ */}
        <Animated.View style={[S.cycleCard,{opacity:fadeA,transform:[{translateY:slideA}]}]}>
          {/* gradient-like overlay strip */}
          <View style={S.cycleCardStrip}/>
          <View style={S.cycleLeft}>
            <View style={S.phaseBadge}>
              <Ico name="sunny" size={11} color={C.rose}/>
              <Text style={S.phaseTxt}>  Ovulation Phase</Text>
            </View>
            <Text style={S.cycleDayNum}>Day {CYCLE_DAY}</Text>
            <Text style={S.cycleDesc}>Your peak fertility{'\n'}window is open.</Text>
            <TouchableOpacity style={S.insightBtn} onPress={()=>navigation.navigate('Calendar')} activeOpacity={0.75}>
              <Text style={S.insightTxt}>View Insights  →</Text>
            </TouchableOpacity>
          </View>
          <View style={S.ringWrap}>
            <View style={S.ringOuter}>
              <View style={S.ringMid}>
                <Text style={S.ringNum}>{CYCLE_DAY}</Text>
                <Text style={S.ringOf}>of {CYCLE_TOTAL}</Text>
              </View>
            </View>
            <View style={S.dotsRow}>
              {Array.from({length:7}).map((_,i)=>(
                <View key={i} style={[S.dot, i<3?S.dotOn:S.dotOff]}/>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* ════════ CYCLE PROGRESS ════════ */}
        <Animated.View style={[S.progCard,{opacity:fadeA}]}>
          <View style={S.progRow}>
            <Text style={S.progLbl}>Cycle Progress</Text>
            <Text style={S.progDay}>Day {CYCLE_DAY} / {CYCLE_TOTAL}</Text>
          </View>
          <View style={S.progTrack}>
            <Animated.View style={[S.progFill,{width:ringA.interpolate({inputRange:[0,1],outputRange:['0%',`${cp}%`]})}]}/>
            {['25%','50%','75%'].map(l=><View key={l} style={[S.progMark,{left:l}]}/>)}
          </View>
          <View style={S.phaseRow}>
            {['Period','Follicular','Ovulation','Luteal'].map(p=><Text key={p} style={S.phaseLbl}>{p}</Text>)}
          </View>
        </Animated.View>

        {/* ════════ QUICK STATS ════════ */}
        <Animated.View style={{opacity:fadeA,transform:[{translateY:slideA}]}}>
          <Text style={S.secTitle}>Quick Stats</Text>
          <View style={S.statsRow}>

            {/* Water */}
            <TouchableOpacity style={[S.statCard,S.statW]} activeOpacity={0.88} onPress={()=>setShowW(true)}>
              <View style={S.statHead}>
                <View style={S.statIconWrap}><WaterSvg color={C.rose} size={20}/></View>
                <Text style={[S.statPct,{color:C.rose}]}>{wP}%</Text>
              </View>
              <Text style={S.statVal}>{wL}<Text style={S.statUnit}> L</Text></Text>
              <Text style={S.statSub}>WATER · {wG}/{WGOAL} glasses</Text>
              <View style={S.statBar}><View style={[S.statFill,{width:`${wP}%`,backgroundColor:wP>=100?C.green:C.rose}]}/></View>
              <View style={S.statBtns}>
                <TouchableOpacity style={S.btnMinus} onPress={e=>{e.stopPropagation?.();setWG(g=>Math.max(g-1,0));}} activeOpacity={0.7}><Text style={[S.btnTxt,{color:C.rose}]}>−</Text></TouchableOpacity>
                <Text style={S.btnHint}>tap to log</Text>
                <TouchableOpacity style={[S.btnPlus,{backgroundColor:C.rose}]} onPress={e=>{e.stopPropagation?.();setWG(g=>Math.min(g+1,WGOAL));}} activeOpacity={0.7}><Text style={[S.btnTxt,{color:C.white}]}>+</Text></TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* Sleep */}
            <TouchableOpacity style={[S.statCard,S.statS]} activeOpacity={0.88} onPress={()=>{setSIH(String(sH));setSIM(String(sM));setShowS(true);}}>
              <View style={S.statHead}>
                <View style={[S.statIconWrap,{backgroundColor:C.purpleMist}]}><MoonSvg color={C.purple} size={20}/></View>
                <Text style={[S.statPct,{color:C.purple}]}>{sP}%</Text>
              </View>
              <Text style={S.statVal}>{sDisp}</Text>
              <Text style={S.statSub}>SLEEP · goal {SGOAL}h</Text>
              <View style={S.statBar}><View style={[S.statFill,{width:`${sP}%`,backgroundColor:C.purple}]}/></View>
              <View style={S.statBtns}>
                <TouchableOpacity style={[S.btnMinus,{borderColor:C.purple}]} onPress={e=>{e.stopPropagation?.();setSH(h=>Math.max(h-1,0));}} activeOpacity={0.7}><Text style={[S.btnTxt,{color:C.purple}]}>−</Text></TouchableOpacity>
                <Text style={S.btnHint}>tap to edit</Text>
                <TouchableOpacity style={[S.btnPlus,{backgroundColor:C.purple,borderColor:C.purple}]} onPress={e=>{e.stopPropagation?.();setSH(h=>Math.min(h+1,23));}} activeOpacity={0.7}><Text style={[S.btnTxt,{color:C.white}]}>+</Text></TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>

          {/* ════════ MOOD CARD ════════ */}
          <View style={S.moodCard}>
            <View style={S.moodLeft}>
              <Animated.Text style={[S.moodBig,{transform:[{scale:bigSc}]}]}>{mood.emoji}</Animated.Text>
              <View>
                <Text style={S.moodTag}>MOOD</Text>
                <Animated.Text style={[S.moodName,{opacity:lbOp,transform:[{translateY:lbTY}]}]}>{mood.label}</Animated.Text>
              </View>
            </View>
            <View style={S.moodPicker}>
              {MOODS.map((m,i)=>{
                const on=i===sel;
                const rot=mRot[i].interpolate({inputRange:[-1,0,1],outputRange:['-45deg','0deg','45deg']});
                return (
                  <TouchableOpacity key={i} style={S.moodBtn} onPress={()=>{if(i!==sel){setSel(i);triggerMood(i);}}} activeOpacity={0.85}>
                    {on&&<Animated.View style={[S.moodBurst,{transform:[{scale:bstSc}],opacity:bstOp}]}/>}
                    {on&&<View style={S.moodGlow}/>}
                    <Animated.View style={{transform:[{scale:mSc[i]},{translateY:mTY[i]},{rotate:rot}]}}>
                      <Text style={[S.moodEmoji,on&&S.moodEmojiOn]}>{m.emoji}</Text>
                    </Animated.View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Animated.View>

        {/* ════════ WATER MODAL ════════ */}
        <Modal visible={showW} transparent animationType="slide" onRequestClose={()=>setShowW(false)}>
          <KeyboardAvoidingView style={S.mOverlay} behavior={Platform.OS==='ios'?'padding':'height'}>
            <TouchableOpacity style={S.mBg} activeOpacity={1} onPress={()=>setShowW(false)}/>
            <View style={[S.mSheet,{paddingBottom:Platform.OS==='ios'?40:28}]}>
              <View style={S.mHandle}/><Text style={S.mTitle}>Water Intake</Text>
              <View style={S.tabRow}>
                {['today','history'].map(t=>(
                  <TouchableOpacity key={t} style={[S.tab,wTab===t&&S.tabOn]} onPress={()=>setWTab(t)} activeOpacity={0.8}>
                    <Text style={[S.tabTxt,wTab===t&&S.tabTxtOn]}>{t==='today'?'Today':'All History'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {wTab==='today'?(
                <>
                  <Text style={S.mSub}>Goal: {WGOAL} glasses ({(WGOAL*GML/1000).toFixed(1)}L) per day</Text>
                  <View style={S.mStat}><Text style={S.mBigVal}>{wL}L</Text><Text style={S.mSub}>{wG} of {WGOAL} glasses</Text><View style={S.mProg}><View style={[S.mProgFill,{width:`${wP}%`,backgroundColor:wP>=100?C.green:C.rose}]}/></View><Text style={[S.mProgTxt,{color:wP>=100?C.green:C.rose}]}>{wP>=100?'✓ Goal reached!':`${wP}% of goal`}</Text></View>
                  <View style={S.glassGrid}>{Array.from({length:WGOAL}).map((_,i)=>(<TouchableOpacity key={i} style={[S.glassBtn,i<wG&&S.glassBtnOn]} onPress={()=>setWG(i+1)} activeOpacity={0.75}><Ico name={i<wG?'water':'water-outline'} size={20} color={i<wG?C.rose:C.roseLight}/><Text style={[S.glassTxt,i<wG&&{color:C.rose}]}>{i+1}</Text></TouchableOpacity>))}</View>
                  <View style={S.mBtns}><TouchableOpacity style={S.mBtnL} onPress={()=>setWG(g=>Math.max(g-1,0))} activeOpacity={0.8}><Text style={S.mBtnLTxt}>− Remove</Text></TouchableOpacity><TouchableOpacity style={S.mBtnR} onPress={()=>setWG(g=>Math.min(g+1,WGOAL))} activeOpacity={0.85}><Text style={S.mBtnRTxt}>+ Add glass</Text></TouchableOpacity></View>
                  <TouchableOpacity style={S.mDone} onPress={()=>setShowW(false)} activeOpacity={0.85}><Text style={S.mDoneTxt}>Done ✓</Text></TouchableOpacity>
                </>
              ):(
                wHist.length===0?(
                  <View style={S.histEmpty}><Ico name="water-outline" size={48} color={C.roseLight}/><Text style={S.histEmptyT}>No history yet</Text><Text style={S.histEmptyS}>Start logging water today.</Text></View>
                ):(
                  <ScrollView showsVerticalScrollIndicator={false} style={{maxHeight:420}}>
                    <View style={S.chartWrap}><Text style={S.chartTitle}>Last 7 Days</Text><View style={S.barChart}>{wHist.slice(0,7).map((d,i)=>{ const p=Math.min(d.glasses/WGOAL,1); const lit=((d.glasses*GML)/1000).toFixed(1); const lb=getDL(d.dateKey); const sh=lb==='Yesterday'?'Yest':lb.split(' ')[0]; return<View key={i} style={S.barCol}><Text style={S.barVal}>{lit}L</Text><View style={S.barTrack}><View style={[S.barFill,{height:`${Math.max(p*100,8)}%`,backgroundColor:p>=1?C.green:p>=0.7?C.rose:C.roseLight}]}/></View><Text style={S.barLbl}>{sh}</Text></View>; })}</View></View>
                    {wHist.map((d,i)=>{ const p=Math.min(Math.round((d.glasses/WGOAL)*100),100); const met=d.glasses>=WGOAL; const lit=((d.glasses*GML)/1000).toFixed(1); return<View key={i} style={S.histRow}><View style={S.histL}><Ico name={met?'checkmark-circle':'water'} size={18} color={met?C.green:C.rose}/><View><Text style={S.histDay}>{getDL(d.dateKey)}</Text><Text style={S.histDet}>{d.glasses}/{WGOAL} · {lit}L</Text></View></View><Text style={[S.histPct,{color:met?C.green:C.rose}]}>{p}%</Text></View>; })}
                    <View style={{height:12}}/>
                  </ScrollView>
                )
              )}
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* ════════ SLEEP MODAL ════════ */}
        <Modal visible={showS} transparent animationType="slide" onRequestClose={()=>setShowS(false)}>
          <KeyboardAvoidingView style={S.mOverlay} behavior={Platform.OS==='ios'?'padding':'height'}>
            <TouchableOpacity style={S.mBg} activeOpacity={1} onPress={()=>setShowS(false)}/>
            <View style={[S.mSheet,{paddingBottom:Platform.OS==='ios'?40:28}]}>
              <View style={S.mHandle}/><Text style={S.mTitle}>Sleep Tracker</Text>
              <View style={S.tabRow}>
                {['today','history'].map(t=>(
                  <TouchableOpacity key={t} style={[S.tab,sTab===t&&S.tabOnSleep]} onPress={()=>setSTab(t)} activeOpacity={0.8}>
                    <Text style={[S.tabTxt,sTab===t&&S.tabTxtOn]}>{t==='today'?'Today':'All History'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {sTab==='today'?(
                <>
                  <Text style={S.mSub}>Recommended: 7–9 hours per night</Text>
                  <View style={S.mStat}><Text style={S.mBigVal}>{sDisp}</Text><View style={S.mProg}><View style={[S.mProgFill,{width:`${sP}%`,backgroundColor:C.purple}]}/></View><Text style={[S.mProgTxt,{color:C.purple}]}>{sP>=100?'✓ Great sleep!':`${sP}% of goal`}</Text></View>
                  <Text style={S.mLbl}>How long did you sleep?</Text>
                  <View style={S.sleepRow}><View style={S.sleepGrp}><TextInput style={S.sleepIn} value={sIH} onChangeText={t=>setSIH(t.replace(/[^0-9]/g,''))} keyboardType="number-pad" maxLength={2} selectTextOnFocus/><Text style={S.sleepUnit}>hours</Text></View><Text style={S.sleepColon}>:</Text><View style={S.sleepGrp}><TextInput style={S.sleepIn} value={sIM} onChangeText={t=>setSIM(t.replace(/[^0-9]/g,''))} keyboardType="number-pad" maxLength={2} selectTextOnFocus/><Text style={S.sleepUnit}>mins</Text></View></View>
                  <Text style={S.mLbl}>Quick select</Text>
                  <View style={S.presets}>{[['5h','5','0'],['6h','6','0'],['7h','7','0'],['7h30m','7','30'],['8h','8','0'],['9h','9','0']].map(([lb,h,m])=>{ const on=sIH===h&&sIM===m; return<TouchableOpacity key={lb} style={[S.preset,on&&S.presetOn]} onPress={()=>{setSIH(h);setSIM(m);}} activeOpacity={0.75}><Text style={[S.presetTxt,on&&{color:C.white}]}>{lb}</Text></TouchableOpacity>; })}</View>
                  <View style={S.mBtns}><TouchableOpacity style={S.mBtnL} onPress={()=>setShowS(false)} activeOpacity={0.8}><Text style={S.mBtnLTxt}>Cancel</Text></TouchableOpacity><TouchableOpacity style={[S.mBtnR,{backgroundColor:C.purple}]} onPress={saveSleep} activeOpacity={0.85}><Text style={S.mBtnRTxt}>Save Sleep ✓</Text></TouchableOpacity></View>
                </>
              ):(
                sHist.length===0?(
                  <View style={S.histEmpty}><Ico name="moon-outline" size={48} color="#C5B8EA"/><Text style={S.histEmptyT}>No history yet</Text><Text style={S.histEmptyS}>Log your sleep today.</Text></View>
                ):(
                  <ScrollView showsVerticalScrollIndicator={false} style={{maxHeight:420}}>
                    <View style={S.chartWrap}><Text style={S.chartTitle}>Last 7 Days</Text><View style={S.barChart}>{sHist.slice(0,7).map((d,i)=>{ const tot=d.h+d.m/60; const p=Math.min(tot/SGOAL,1); const lb2=getDL(d.dateKey); const sh=lb2==='Yesterday'?'Yest':lb2.split(' ')[0]; const lab=d.m>0?`${d.h}h${d.m}m`:`${d.h}h`; return<View key={i} style={S.barCol}><Text style={S.barVal}>{lab}</Text><View style={S.barTrack}><View style={[S.barFill,{height:`${Math.max(p*100,8)}%`,backgroundColor:p>=1?C.green:p>=0.75?C.purple:'#C5B8EA'}]}/></View><Text style={S.barLbl}>{sh}</Text></View>; })}</View></View>
                    {sHist.map((d,i)=>{ const tot=d.h*60+d.m; const p=Math.min(Math.round((tot/(SGOAL*60))*100),100); const met=tot>=SGOAL*60; const disp=d.m>0?`${d.h}h ${String(d.m).padStart(2,'0')}m`:`${d.h}h`; return<View key={i} style={S.histRow}><View style={S.histL}><Ico name={met?'checkmark-circle':'moon'} size={18} color={met?C.green:C.purple}/><View><Text style={S.histDay}>{getDL(d.dateKey)}</Text><Text style={S.histDet}>{disp} slept</Text></View></View><Text style={[S.histPct,{color:met?C.green:C.purple}]}>{p}%</Text></View>; })}
                    <View style={{height:12}}/>
                  </ScrollView>
                )
              )}
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* ════════ REMINDERS ════════ */}
        <Animated.View style={{opacity:fadeA}}>
          <View style={S.secHead}>
            <Text style={S.secTitle}>Reminders</Text>
            <TouchableOpacity onPress={()=>navigation.navigate('Reminders')}><Text style={S.seeAll}>See all</Text></TouchableOpacity>
          </View>
          {reminders.length===0?(
            <TouchableOpacity style={S.emptyRem} onPress={()=>navigation.navigate('Reminders')}>
              <Text style={S.emptyRemTxt}>＋ Add your first reminder</Text>
            </TouchableOpacity>
          ):(
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={S.remScroll}>
              {reminders.slice(0,6).map(r=>(
                <View key={r.id} style={[S.remChip,{backgroundColor:r.color||C.roseFog}]}>
                  <View style={S.remIco}><Ico name={r.icon} size={18} color={C.rose}/></View>
                  <Text style={S.remTitle} numberOfLines={1}>{r.title}</Text>
                  <Text style={S.remTime}>{r.time}</Text>
                </View>
              ))}
              <TouchableOpacity style={S.remAdd} onPress={()=>navigation.navigate('Reminders')}>
                <Text style={S.remAddIco}>＋</Text>
                <Text style={S.remAddTxt}>Add</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </Animated.View>

        {/* ════════ EXERCISE ════════ */}
        <Animated.View style={{opacity:fadeA,transform:[{translateY:slideA}]}}>
          <View style={S.secHead}>
            <Text style={S.secTitle}>Exercise Modules</Text>
            <TouchableOpacity onPress={()=>navigation.navigate('Exercise')}><Text style={S.seeAll}>See all</Text></TouchableOpacity>
          </View>
          {EXERCISE_MODULES.map(mod=>(
            <TouchableOpacity key={mod.id} style={[S.exCard,{backgroundColor:mod.bg}]} onPress={()=>navigation.navigate('ExerciseDetail',{module:mod})} activeOpacity={0.85}>
              <View style={[S.exStrip,{backgroundColor:mod.accent}]}/>
              <View style={[S.exIco,{backgroundColor:mod.accent+'22'}]}>
                <Ico name={mod.icon} size={26} color={mod.accent}/>
              </View>
              <View style={S.exInfo}>
                <Text style={[S.exTitle,{color:mod.accent}]}>{mod.title}</Text>
                <Text style={S.exSub}>{mod.subtitle}</Text>
                <View style={{flexDirection:'row',alignItems:'center',gap:4}}>
                  <Ico name="play" size={9} color={mod.accent}/>
                  <Text style={[S.exCount,{color:mod.accent}]}>{mod.videoCount} videos</Text>
                </View>
              </View>
              <View style={[S.exArrow,{backgroundColor:mod.accent+'18'}]}>
                <Ico name="chevron-forward" size={18} color={mod.accent}/>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>

        <View style={{height:130}}/>
      </ScrollView>

      {/* ════════ CHAT FAB ════════ */}
      <Animated.View pointerEvents="none" style={[S.fabRipple,{transform:[{scale:rip1}],opacity:rip1.interpolate({inputRange:[1,1.6],outputRange:[0.32,0]})}]}/>
      <Animated.View pointerEvents="none" style={[S.fabRipple,{transform:[{scale:rip2}],opacity:rip2.interpolate({inputRange:[1,1.9],outputRange:[0.16,0]})}]}/>
      <Animated.View style={[S.fabWrap,{transform:[{scale:botP}]}]}>
        <TouchableOpacity style={S.fab} onPress={()=>navigation.navigate('Chatbot')} activeOpacity={0.85}>
          <Animated.View style={{transform:[{translateY:floatA}]}}>
            <Animated.View style={{transform:[{rotate:wigA.interpolate({inputRange:[-1,0,1],outputRange:['-6deg','0deg','6deg']})}]}}>
              <ChatBubbleHeart size={44}/>
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {/* ════════ BOTTOM NAV — matches image 2 ════════ */}
      <View style={S.nav}>
        {NAV_TABS.map(tab=>{
          const on=activeTab===tab.key;
          const color=on?C.rose:C.faint;
          return (
            <TouchableOpacity key={tab.key} style={S.navTab} onPress={()=>{ setActiveTab(tab.key); if(tab.key==='Calendar')navigation.navigate('Calendar'); if(tab.key==='Doctor')navigation.navigate('Doctor'); if(tab.key==='Social')navigation.navigate('Social'); if(tab.key==='Shop')navigation.navigate('Shop'); }} activeOpacity={0.7}>
              {/* Active: soft blush circle behind icon */}
              {on&&<View style={S.navActiveCircle}/>}
              {/* Top indicator pill */}
              {on&&<View style={S.navPill}/>}
              <tab.Icon color={color} size={24}/>
              <Text style={[S.navLbl,on&&S.navLblOn]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════
// STYLES — airy, spacious, soft rose palette
// ═══════════════════════════════════════════════════
const cardShadow = { shadowColor:'#D06070', shadowOffset:{width:0,height:4}, shadowOpacity:0.08, shadowRadius:12, elevation:3 };

const S = StyleSheet.create({
  safe:    { flex:1, backgroundColor:C.bg },
  scroll:  { flex:1 },
  content: { paddingHorizontal:22, paddingTop:14 },

  // Background blobs
  blob1: { position:'absolute', width:220, height:220, borderRadius:110, backgroundColor:C.roseFog, opacity:0.5, top:-80, right:-80 },
  blob2: { position:'absolute', width:160, height:160, borderRadius:80,  backgroundColor:C.roseMist, opacity:0.6, top:280, left:-60 },

  // ── Top bar ──
  topBar:    { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:28 },
  avatarRow: { flexDirection:'row', alignItems:'center', gap:14 },
  avatar:    { width:50, height:50, borderRadius:25, backgroundColor:C.rose, alignItems:'center', justifyContent:'center', shadowColor:C.rose, shadowOffset:{width:0,height:4}, shadowOpacity:0.3, shadowRadius:10, elevation:6, borderWidth:2.5, borderColor:C.white },
  avatarTxt: { color:C.white, fontSize:16, fontWeight:'800' },
  onlineDot: { position:'absolute', bottom:1, right:1, width:13, height:13, borderRadius:6.5, backgroundColor:C.green, borderWidth:2.5, borderColor:C.white },
  greeting:  { fontSize:17, fontWeight:'800', color:C.text, letterSpacing:-0.3 },
  dateTxt:   { fontSize:11, color:C.sub, letterSpacing:1.4, fontWeight:'600' },
  bellBtn:   { width:46, height:46, borderRadius:23, backgroundColor:C.white, alignItems:'center', justifyContent:'center', borderWidth:1.5, borderColor:C.roseFog, ...cardShadow },
  bellDot:   { position:'absolute', top:10, right:10, width:9, height:9, borderRadius:4.5, backgroundColor:C.rose, borderWidth:2, borderColor:C.white },

  // ── Cycle card ──
  cycleCard:      { backgroundColor:C.white, borderRadius:28, padding:22, flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:16, ...cardShadow, borderWidth:0 },
  cycleCardStrip: { position:'absolute', left:0, top:0, bottom:0, width:6, backgroundColor:C.rose, borderTopLeftRadius:28, borderBottomLeftRadius:28, opacity:0.7 },
  cycleLeft:      { flex:1, paddingRight:16, paddingLeft:8 },
  phaseBadge:     { flexDirection:'row', alignItems:'center', backgroundColor:C.roseMist, borderRadius:20, paddingHorizontal:12, paddingVertical:5, alignSelf:'flex-start', marginBottom:12 },
  phaseTxt:       { fontSize:11, color:C.rose, fontWeight:'800' },
  cycleDayNum:    { fontSize:32, fontWeight:'900', color:C.text, marginBottom:6, letterSpacing:-1 },
  cycleDesc:      { fontSize:13, color:C.sub, lineHeight:20, marginBottom:16 },
  insightBtn:     { alignSelf:'flex-start', paddingVertical:8, paddingHorizontal:16, backgroundColor:C.roseMist, borderRadius:20 },
  insightTxt:     { fontSize:13, color:C.rose, fontWeight:'800' },
  ringWrap:       { alignItems:'center', gap:10 },
  ringOuter:      { width:88, height:88, borderRadius:44, borderWidth:5, borderColor:C.roseFog, alignItems:'center', justifyContent:'center', backgroundColor:C.roseMist },
  ringMid:        { alignItems:'center' },
  ringNum:        { fontSize:28, fontWeight:'900', color:C.rose, lineHeight:32 },
  ringOf:         { fontSize:10, color:C.sub, fontWeight:'600' },
  dotsRow:        { flexDirection:'row', gap:5 },
  dot:            { width:7, height:7, borderRadius:3.5 },
  dotOn:          { backgroundColor:C.rose },
  dotOff:         { backgroundColor:C.roseFog },

  // ── Progress card ──
  progCard:  { backgroundColor:C.white, borderRadius:20, padding:18, marginBottom:28, ...cardShadow },
  progRow:   { flexDirection:'row', justifyContent:'space-between', marginBottom:10 },
  progLbl:   { fontSize:13, fontWeight:'700', color:C.text },
  progDay:   { fontSize:13, color:C.sub, fontWeight:'600' },
  progTrack: { height:8, backgroundColor:C.roseMist, borderRadius:4, overflow:'hidden', marginBottom:10, position:'relative' },
  progFill:  { height:'100%', backgroundColor:C.rose, borderRadius:4 },
  progMark:  { position:'absolute', top:0, bottom:0, width:2, backgroundColor:C.white, opacity:0.9 },
  phaseRow:  { flexDirection:'row', justifyContent:'space-between' },
  phaseLbl:  { fontSize:10, color:C.sub, fontWeight:'600' },

  // ── Section headers ──
  secHead:   { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:14 },
  secTitle:  { fontSize:17, fontWeight:'800', color:C.text, marginBottom:0 },
  seeAll:    { fontSize:13, color:C.rose, fontWeight:'700' },

  // ── Stats ──
  statsRow:     { flexDirection:'row', gap:14, marginBottom:14 },
  statCard:     { flex:1, borderRadius:24, padding:18, ...cardShadow },
  statW:        { backgroundColor:'#FFF4F6' },
  statS:        { backgroundColor:'#F5F0FD' },
  statHead:     { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10 },
  statIconWrap: { width:36, height:36, borderRadius:18, backgroundColor:C.roseMist, alignItems:'center', justifyContent:'center' },
  statPct:      { fontSize:12, fontWeight:'800' },
  statVal:      { fontSize:26, fontWeight:'900', color:C.text, letterSpacing:-0.8, marginBottom:3 },
  statUnit:     { fontSize:14, fontWeight:'600', color:C.sub },
  statSub:      { fontSize:10, color:C.sub, fontWeight:'700', letterSpacing:0.5, marginBottom:10 },
  statBar:      { height:4, backgroundColor:'rgba(0,0,0,0.06)', borderRadius:2, overflow:'hidden', marginBottom:12 },
  statFill:     { height:'100%', borderRadius:2 },
  statBtns:     { flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  btnMinus:     { width:30, height:30, borderRadius:15, borderWidth:1.5, borderColor:C.rose, alignItems:'center', justifyContent:'center', backgroundColor:C.white },
  btnPlus:      { width:30, height:30, borderRadius:15, borderWidth:1.5, borderColor:C.rose, alignItems:'center', justifyContent:'center' },
  btnTxt:       { fontSize:18, fontWeight:'700', lineHeight:22 },
  btnHint:      { fontSize:10, color:C.sub, fontWeight:'600' },

  // ── Mood card ──
  moodCard:     { backgroundColor:C.white, borderRadius:24, padding:18, flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:28, ...cardShadow },
  moodLeft:     { flexDirection:'row', alignItems:'center', gap:12 },
  moodBig:      { fontSize:36, lineHeight:44 },
  moodTag:      { fontSize:9, color:C.sub, fontWeight:'800', letterSpacing:1.8, marginBottom:3 },
  moodName:     { fontSize:16, fontWeight:'800', color:C.text },
  moodPicker:   { flexDirection:'row', alignItems:'center', gap:4 },
  moodBtn:      { width:38, height:46, alignItems:'center', justifyContent:'center', position:'relative' },
  moodEmoji:    { fontSize:20 },
  moodEmojiOn:  { fontSize:23 },
  moodGlow:     { position:'absolute', width:34, height:34, borderRadius:17, backgroundColor:C.rose, opacity:0.12 },
  moodBurst:    { position:'absolute', width:30, height:30, borderRadius:15, borderWidth:2, borderColor:C.rose },

  // ── Modals ──
  mOverlay: { flex:1, justifyContent:'flex-end' },
  mBg:      { position:'absolute', top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(0,0,0,0.4)' },
  mSheet:   { backgroundColor:C.white, borderTopLeftRadius:32, borderTopRightRadius:32, padding:26 },
  mHandle:  { width:40, height:4, borderRadius:2, backgroundColor:C.roseFog, alignSelf:'center', marginBottom:22 },
  mTitle:   { fontSize:22, fontWeight:'900', color:C.text, marginBottom:6, letterSpacing:-0.3 },
  mSub:     { fontSize:12, color:C.sub, marginBottom:16 },
  mStat:    { backgroundColor:C.roseMist, borderRadius:18, padding:18, alignItems:'center', marginBottom:18 },
  mBigVal:  { fontSize:44, fontWeight:'900', color:C.text, letterSpacing:-1 },
  mProg:    { width:'100%', height:8, backgroundColor:C.roseFog, borderRadius:4, overflow:'hidden', marginBottom:8, marginTop:8 },
  mProgFill:{ height:'100%', borderRadius:4 },
  mProgTxt: { fontSize:12, fontWeight:'700' },
  mLbl:     { fontSize:13, fontWeight:'700', color:C.text, marginBottom:10, marginTop:4 },
  mBtns:    { flexDirection:'row', gap:12, marginBottom:10 },
  mBtnL:    { flex:1, borderRadius:16, paddingVertical:14, alignItems:'center', borderWidth:2, borderColor:C.roseFog },
  mBtnLTxt: { fontSize:14, color:C.sub, fontWeight:'700' },
  mBtnR:    { flex:1.5, borderRadius:16, paddingVertical:14, alignItems:'center', backgroundColor:C.rose, shadowColor:C.rose, shadowOffset:{width:0,height:4}, shadowOpacity:0.25, shadowRadius:8, elevation:5 },
  mBtnRTxt: { fontSize:14, color:C.white, fontWeight:'800' },
  mDone:    { borderRadius:16, paddingVertical:14, alignItems:'center', backgroundColor:C.roseMist },
  mDoneTxt: { fontSize:14, color:C.rose, fontWeight:'800' },
  tabRow:   { flexDirection:'row', backgroundColor:C.roseMist, borderRadius:14, padding:4, marginBottom:14 },
  tab:      { flex:1, paddingVertical:8, alignItems:'center', borderRadius:10 },
  tabOn:    { backgroundColor:C.rose, shadowColor:C.rose, shadowOffset:{width:0,height:2}, shadowOpacity:0.25, shadowRadius:6, elevation:4 },
  tabOnSleep:{ backgroundColor:C.purple, shadowColor:C.purple, shadowOffset:{width:0,height:2}, shadowOpacity:0.25, shadowRadius:6, elevation:4 },
  tabTxt:   { fontSize:12, fontWeight:'700', color:C.sub },
  tabTxtOn: { color:C.white },
  glassGrid:{ flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:18, justifyContent:'center' },
  glassBtn: { width:52, height:60, borderRadius:14, backgroundColor:C.roseMist, alignItems:'center', justifyContent:'center', borderWidth:1.5, borderColor:C.roseFog },
  glassBtnOn:{ borderColor:C.rose, backgroundColor:'#FFF0F3' },
  glassTxt: { fontSize:10, fontWeight:'700', color:C.sub, marginTop:2 },
  sleepRow: { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:16, marginBottom:18 },
  sleepGrp: { alignItems:'center', gap:4 },
  sleepIn:  { width:72, height:64, backgroundColor:C.roseMist, borderRadius:16, textAlign:'center', fontSize:28, fontWeight:'800', color:C.text, borderWidth:2, borderColor:C.roseFog },
  sleepUnit:{ fontSize:11, color:C.sub, fontWeight:'600' },
  sleepColon:{ fontSize:32, fontWeight:'800', color:C.text, marginBottom:16 },
  presets:  { flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:20 },
  preset:   { borderRadius:20, paddingHorizontal:16, paddingVertical:8, backgroundColor:C.roseMist, borderWidth:1.5, borderColor:C.roseFog },
  presetOn: { backgroundColor:C.purple, borderColor:C.purple },
  presetTxt:{ fontSize:13, fontWeight:'700', color:C.sub },
  histEmpty:{ alignItems:'center', paddingVertical:40, gap:10 },
  histEmptyT:{ fontSize:16, fontWeight:'800', color:C.text },
  histEmptyS:{ fontSize:13, color:C.sub, textAlign:'center' },
  chartWrap:{ backgroundColor:C.roseMist, borderRadius:18, padding:16, marginBottom:14 },
  chartTitle:{ fontSize:13, fontWeight:'800', color:C.text, marginBottom:12 },
  barChart: { flexDirection:'row', alignItems:'flex-end', height:100, gap:6, marginBottom:10 },
  barCol:   { flex:1, alignItems:'center', gap:4 },
  barVal:   { fontSize:9, fontWeight:'700', color:C.sub, textAlign:'center' },
  barTrack: { flex:1, width:'100%', backgroundColor:C.roseFog, borderRadius:6, overflow:'hidden', justifyContent:'flex-end' },
  barFill:  { width:'100%', borderRadius:6 },
  barLbl:   { fontSize:9, color:C.sub, fontWeight:'600', textAlign:'center' },
  histRow:  { flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:C.roseMist, borderRadius:14, padding:14, marginBottom:8 },
  histL:    { flexDirection:'row', alignItems:'center', gap:10 },
  histDay:  { fontSize:13, fontWeight:'700', color:C.text },
  histDet:  { fontSize:11, color:C.sub, marginTop:1 },
  histPct:  { fontSize:13, fontWeight:'800' },

  // ── Reminders ──
  remScroll:   { marginBottom:32 },
  remChip:     { borderRadius:22, padding:16, marginRight:14, width:128 },
  remIco:      { width:36, height:36, backgroundColor:'rgba(255,255,255,0.55)', borderRadius:18, alignItems:'center', justifyContent:'center', marginBottom:8 },
  remTitle:    { fontSize:13, fontWeight:'700', color:C.text, marginBottom:4 },
  remTime:     { fontSize:11, color:C.sub, fontWeight:'500' },
  remAdd:      { borderRadius:22, padding:16, marginRight:14, width:100, alignItems:'center', justifyContent:'center', backgroundColor:C.white, borderWidth:2, borderColor:C.roseFog, borderStyle:'dashed' },
  remAddIco:   { fontSize:24, color:C.rose, marginBottom:5 },
  remAddTxt:   { fontSize:12, color:C.rose, fontWeight:'700' },
  emptyRem:    { backgroundColor:C.white, borderRadius:18, padding:20, alignItems:'center', borderWidth:2, borderColor:C.roseFog, borderStyle:'dashed', marginBottom:28 },
  emptyRemTxt: { fontSize:14, color:C.rose, fontWeight:'700' },

  // ── Exercise ──
  exCard:  { flexDirection:'row', alignItems:'center', borderRadius:22, padding:18, marginBottom:14, overflow:'hidden', position:'relative', ...cardShadow },
  exStrip: { position:'absolute', left:0, top:0, bottom:0, width:5 },
  exIco:   { width:56, height:56, borderRadius:28, alignItems:'center', justifyContent:'center', marginRight:16, marginLeft:8 },
  exInfo:  { flex:1 },
  exTitle: { fontSize:15, fontWeight:'800', marginBottom:4 },
  exSub:   { fontSize:12, color:C.sub, marginBottom:6 },
  exCount: { fontSize:12, fontWeight:'700' },
  exArrow: { width:36, height:36, borderRadius:18, alignItems:'center', justifyContent:'center', marginLeft:8 },

  // ── FAB ──
  fabWrap:  { position:'absolute', bottom:120, right:22, zIndex:200 },
  fab:      { width:66, height:66, borderRadius:33, backgroundColor:C.roseMist, alignItems:'center', justifyContent:'center', borderWidth:2, borderColor:C.roseFog, shadowColor:C.rose, shadowOffset:{width:0,height:8}, shadowOpacity:0.35, shadowRadius:16, elevation:14 },
  fabRipple:{ position:'absolute', bottom:120, right:22, width:66, height:66, borderRadius:33, backgroundColor:C.rose, zIndex:198 },

  // ── Bottom Nav — soft, airy, matches image 2 ──
  nav:    { flexDirection:'row', backgroundColor:C.white, paddingBottom:30, paddingTop:10, paddingHorizontal:4, borderTopWidth:1, borderTopColor:C.roseFog, shadowColor:'#000', shadowOffset:{width:0,height:-3}, shadowOpacity:0.05, shadowRadius:10, elevation:12, minHeight:74 },
  navTab: { flex:1, alignItems:'center', justifyContent:'center', paddingVertical:4, position:'relative', gap:3 },
  navPill:        { position:'absolute', top:-10, width:24, height:3, borderRadius:1.5, backgroundColor:C.rose },
  navActiveCircle:{ position:'absolute', top:0, width:46, height:46, borderRadius:23, backgroundColor:C.roseCircle, zIndex:-1 },
  navLbl:    { fontSize:10, color:C.faint, fontWeight:'500', letterSpacing:0.1 },
  navLblOn:  { color:C.rose, fontWeight:'700' },
});