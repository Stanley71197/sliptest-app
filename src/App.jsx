import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";

const ALL_SUBJECTS = ["Telugu","Hindi","English","Maths","Science","Social"];
const SCHOOLS = [
{ id:"SCH001", name:"LAGGHS MACHILIPATNAM", hmName:"HM", hmUser:"hm_lagghs_mtm", hmPass:"hm123" },
  { id:"SCH003", name:"GOVT RAMJEE HIGH SCHOOL MACHILIPATNAM", hmName:"HM", hmUser:"hm_grgh_mtm", hmPass:"hm123" },
  { id:"SCH005", name:"GOVT HIGH SCHOOL DOKIPARRU", hmName:"HM", hmUser:"hm_ghs_dokiparru", hmPass:"hm123" },
  { id:"SCH006", name:"ZPHS CHENNURUI", hmName:"HM", hmUser:"hm_zphs_chennurui", hmPass:"hm123" },
  { id:"SCH007", name:"ZPHS NIDUMOLU", hmName:"HM", hmUser:"hm_zphs_nidumolu", hmPass:"hm123" },
  { id:"SCH008", name:"ZPHS MALLAVOLU", hmName:"HM", hmUser:"hm_zphs_mallavolu", hmPass:"hm123" },
  { id:"SCH009", name:"ZPHS VADLAMANNADU", hmName:"HM", hmUser:"hm_zphs_vadlamannadu", hmPass:"hm123" },
  { id:"SCH010", name:"ZPHS GUDUR", hmName:"HM", hmUser:"hm_zphs_gudur", hmPass:"hm123" },
  { id:"SCH011", name:"ZPHS KANKATAVA", hmName:"HM", hmUser:"hm_zphs_kankatava", hmPass:"hm123" },
  { id:"SCH012", name:"ZPHS TALLAPALEM", hmName:"HM", hmUser:"hm_zphs_tallapalem", hmPass:"hm123" },
  { id:"SCH013", name:"ZPHS CHINNAPURAM", hmName:"HM", hmUser:"hm_zphs_chinnapuram", hmPass:"hm123" },
  { id:"SCH014", name:"ZPHS MAJERU", hmName:"HM", hmUser:"hm_zphs_majeru", hmPass:"hm123" },
  { id:"SCH015", name:"ZPHS GUNDUPALEM", hmName:"HM", hmUser:"hm_zphs_gundupalem", hmPass:"hm123" },
  { id:"SCH016", name:"ZPHS PENUMALLI", hmName:"HM", hmUser:"hm_zphs_penumalli", hmPass:"hm123" },
  { id:"SCH017", name:"ZPHS V KANURU", hmName:"HM", hmUser:"hm_zphs_kanuru", hmPass:"hm123" },
  { id:"SCH018", name:"ZPHS TAPASIPUDI", hmName:"HM", hmUser:"hm_zphs_tapasipudi", hmPass:"hm123" },
  { id:"SCH019", name:"ZPHS MANGALAPURAM", hmName:"HM", hmUser:"hm_zphs_mangalapuram", hmPass:"hm123" },
  { id:"SCH020", name:"ZPHS KAPPALADODDI", hmName:"HM", hmUser:"hm_zphs_kappaladoddi", hmPass:"hm123" },
  { id:"SCH021", name:"ZPHS PEDANA", hmName:"HM", hmUser:"hm_zphs_pedana", hmPass:"hm123" },
  { id:"SCH022", name:"ZPHS TARAKATURU", hmName:"HM", hmUser:"hm_zphs_tarakaturu", hmPass:"hm123" },
  { id:"SCH023", name:"ZPHS NANDIGAMA", hmName:"HM", hmUser:"hm_zphs_nandigama", hmPass:"hm123" },
  { id:"SCH024", name:"ZPHS RAYAVARAM", hmName:"HM", hmUser:"hm_zphs_rayavaram", hmPass:"hm123" },
  { id:"SCH025", name:"ZPHS BUDDALAPALEM", hmName:"HM", hmUser:"hm_zphs_buddalapalem", hmPass:"hm123" },
  { id:"SCH026", name:"ZPHS POLATITHIPPA", hmName:"HM", hmUser:"hm_zphs_polatithippa", hmPass:"hm123" },
  { id:"SCH027", name:"ZPHS CHITTIPALEM", hmName:"HM", hmUser:"hm_zphs_chittipalem", hmPass:"hm123" },
  { id:"SCH031", name:"GOVT HIGH SCHOOL AVANIGADDA", hmName:"HM", hmUser:"hm_ghs_avanigadda", hmPass:"hm123" },
  { id:"SCH032", name:"GOVT ASHRAM HS MOPIDEVI", hmName:"HM", hmUser:"hm_ahs_mopidevi", hmPass:"hm123" },
  { id:"SCH033", name:"ZPHS ETIMOGA", hmName:"HM", hmUser:"hm_zphs_etimoga", hmPass:"hm123" },
  { id:"SCH034", name:"ZPHS SWATANTRAPURAM", hmName:"HM", hmUser:"hm_zphs_swatantrapuram", hmPass:"hm123" },
  { id:"SCH035", name:"ZPHS K KOTHAPALEM", hmName:"HM", hmUser:"hm_zphs_kkothapalem", hmPass:"hm123" },
  { id:"SCH036", name:"ZPHS MOPIDEVI", hmName:"HM", hmUser:"hm_zphs_mopidevi", hmPass:"hm123" },
  { id:"SCH037", name:"ZPHS NAGAYALANKA", hmName:"HM", hmUser:"hm_zphs_nagayalanka", hmPass:"hm123" },
  { id:"SCH038", name:"ZPHS V KOTAPALEM", hmName:"HM", hmUser:"hm_zphs_vkotapalem", hmPass:"hm123" },
  { id:"SCH039", name:"ZPHS TALAGADADEEVI", hmName:"HM", hmUser:"hm_zphs_talagadadeevi", hmPass:"hm123" },
  { id:"SCH040", name:"ZPHS PEDAPROLU", hmName:"HM", hmUser:"hm_zphs_pedaprolu", hmPass:"hm123" },
  { id:"SCH041", name:"ZPHS LINGAREDDYPALEM", hmName:"HM", hmUser:"hm_zphs_lingareddypalem", hmPass:"hm123" },
  { id:"SCH042", name:"ZPHS AVANIGADDA", hmName:"HM", hmUser:"hm_zphs_avanigadda", hmPass:"hm123" },
  { id:"SCH043", name:"ZPHS BHAVADEVARAPALLI", hmName:"HM", hmUser:"hm_zphs_bhavadevarapalli", hmPass:"hm123" },
  { id:"SCH044", name:"ZPHS KALLEPALLE", hmName:"HM", hmUser:"hm_zphs_kallepalle", hmPass:"hm123" },
  { id:"SCH049", name:"ZPHS ARTHAMURU", hmName:"HM", hmUser:"hm_zphs_arthamuru", hmPass:"hm123" },
  { id:"SCH050", name:"ZPHS CHINAGOLLAPALEM", hmName:"HM", hmUser:"hm_zphs_chinagollapalem", hmPass:"hm123" },
  { id:"SCH051", name:"ZPHS CHORAMPUDI", hmName:"HM", hmUser:"hm_zphs_chorampudi", hmPass:"hm123" },
  { id:"SCH052", name:"ZPHS LAKSHMIPURAM", hmName:"HM", hmUser:"hm_zphs_lakshmipuram", hmPass:"hm123" },
  { id:"SCH053", name:"ZPHS MALAPARAJUGUDEM", hmName:"HM", hmUser:"hm_zphs_malaparajugudem", hmPass:"hm123" },
  { id:"SCH054", name:"ZPHS MUNJULURU", hmName:"HM", hmUser:"hm_zphs_munjuluru", hmPass:"hm123" },
  { id:"SCH055", name:"ZPHS SKKM PEDATUMIDI", hmName:"HM", hmUser:"hm_zphs_skkmpedatumidi", hmPass:"hm123" },
  { id:"SCH056", name:"ZPHS SANGAMUDI", hmName:"HM", hmUser:"hm_zphs_sangamudi", hmPass:"hm123" },
  { id:"SCH057", name:"ZPHS PODU", hmName:"HM", hmUser:"hm_zphs_podu", hmPass:"hm123" },
  { id:"SCH058", name:"ZPHS CHINAPANDRAKA", hmName:"HM", hmUser:"hm_zphs_chinapandraka", hmPass:"hm123" },
  { id:"SCH059", name:"ZPHS PALLEPALEM", hmName:"HM", hmUser:"hm_zphs_pallepalem", hmPass:"hm123" },
  { id:"SCH060", name:"ZPHS RALLAREVU", hmName:"HM", hmUser:"hm_zphs_rallarevu", hmPass:"hm123" },
  { id:"SCH061", name:"ZPHS MATLAM", hmName:"HM", hmUser:"hm_zphs_matlam", hmPass:"hm123" },
  { id:"SCH062", name:"ZPHS BANTUMILLI", hmName:"HM", hmUser:"hm_zphs_bantumilli", hmPass:"hm123" },
  { id:"SCH065", name:"ZPHS ATKURU", hmName:"HM", hmUser:"hm_zphs_atkuru", hmPass:"hm123" },
  { id:"SCH066", name:"ZPHS DAVAJIGUDEM", hmName:"HM", hmUser:"hm_zphs_davajigudem", hmPass:"hm123" },
  { id:"SCH067", name:"ZPHS FOR BOYS GANNAVARAM", hmName:"HM", hmUser:"hm_zphs_boysgannavaram", hmPass:"hm123" },
  { id:"SCH068", name:"ZPHS FOR GIRLS GANNAVARAM(VOC)", hmName:"HM", hmUser:"hm_zphs_girlsgannavaram", hmPass:"hm123" },
  { id:"SCH069", name:"ZPHS GOLLANAPALLI", hmName:"HM", hmUser:"hm_zphs_gollanapalli", hmPass:"hm123" },
  { id:"SCH070", name:"ZPHS MANTHENA", hmName:"HM", hmUser:"hm_zphs_manthena", hmPass:"hm123" },
  { id:"SCH071", name:"ZPHS TELAPROLU VOC", hmName:"HM", hmUser:"hm_zphs_telaproluvoc", hmPass:"hm123" },
  { id:"SCH072", name:"ZPHS UNGUTURU", hmName:"HM", hmUser:"hm_zphs_unguturu", hmPass:"hm123" },
  { id:"SCH073", name:"ZPHS VEERAVALLI", hmName:"HM", hmUser:"hm_zphs_veeravalli", hmPass:"hm123" },
  { id:"SCH074", name:"ZPHS VEERAPANENIGUDEM", hmName:"HM", hmUser:"hm_zphs_veerapanenigudem", hmPass:"hm123" },
  { id:"SCH075", name:"ZPHS VELDIPADU", hmName:"HM", hmUser:"hm_zphs_veldipadu", hmPass:"hm123" },
  { id:"SCH076", name:"ZPHS VELERU", hmName:"HM", hmUser:"hm_zphs_veleru", hmPass:"hm123" },
  { id:"SCH077", name:"ZPHS TARIGOPPULA", hmName:"HM", hmUser:"hm_zphs_tarigoppula", hmPass:"hm123" },
  { id:"SCH078", name:"ZPHS PEDA AVUTAPALLI", hmName:"HM", hmUser:"hm_zphs_pedaavutapalli", hmPass:"hm123" },
  { id:"SCH082", name:"GOVT GIRLS HIGH SCHOOL ANGALURU", hmName:"HM", hmUser:"hm_gghs_angaluru", hmPass:"hm123" },
  { id:"SCH084", name:"ZPHS ANGALURU", hmName:"HM", hmUser:"hm_zphs_angaluru", hmPass:"hm123" },
  { id:"SCH085", name:"ZPHS ARUGOLANU", hmName:"HM", hmUser:"hm_zphs_arugolanu", hmPass:"hm123" },
  { id:"SCH086", name:"ZPHS CHOWTAPALLI", hmName:"HM", hmUser:"hm_zphs_chowtapalli", hmPass:"hm123" },
  { id:"SCH087", name:"ZPHS DOSAPADU", hmName:"HM", hmUser:"hm_zphs_dosapadu", hmPass:"hm123" },
  { id:"SCH088", name:"ZPHS ELAMARRU", hmName:"HM", hmUser:"hm_zphs_elamarru", hmPass:"hm123" },
  { id:"SCH089", name:"ZPHS GANGADHARAPURAM", hmName:"HM", hmUser:"hm_zphs_gangadharapuram", hmPass:"hm123" },
  { id:"SCH090", name:"ZPHS KANUMOLU", hmName:"HM", hmUser:"hm_zphs_kanumolu", hmPass:"hm123" },
  { id:"SCH091", name:"ZPHS KOWTHARAM (VOC)", hmName:"HM", hmUser:"hm_zphs_kowtharamvoc", hmPass:"hm123" },
  { id:"SCH092", name:"ZPHS MOTURU", hmName:"HM", hmUser:"hm_zphs_moturu", hmPass:"hm123" },
  { id:"SCH093", name:"ZPHS MANIKONDA", hmName:"HM", hmUser:"hm_zphs_manikonda", hmPass:"hm123" },
  { id:"SCH094", name:"ZPHS NANDIVADA", hmName:"HM", hmUser:"hm_zphs_nandivada", hmPass:"hm123" },
  { id:"SCH095", name:"ZPHS PEDAPARUPUDI", hmName:"HM", hmUser:"hm_zphs_pedaparupudi", hmPass:"hm123" },
  { id:"SCH096", name:"ZPHS RUDRAPAKA", hmName:"HM", hmUser:"hm_zphs_rudrapaka", hmPass:"hm123" },
  { id:"SCH097", name:"ZPHS TAMIRISA", hmName:"HM", hmUser:"hm_zphs_tamirisa", hmPass:"hm123" },
  { id:"SCH098", name:"ZPHS VANAPAMULA", hmName:"HM", hmUser:"hm_zphs_vanapamula", hmPass:"hm123" },
  { id:"SCH099", name:"ZPHS VENNANAPUDI", hmName:"HM", hmUser:"hm_zphs_vennanapudi", hmPass:"hm123" },
  { id:"SCH100", name:"ZPHS VENTRAPRAGADA", hmName:"HM", hmUser:"hm_zphs_ventrapragada", hmPass:"hm123" },
  { id:"SCH101", name:"ZPHS VINNAKOTA", hmName:"HM", hmUser:"hm_zphs_vinnakota", hmPass:"hm123" },
  { id:"SCH102", name:"ZPHS PUTTAGUNTA", hmName:"HM", hmUser:"hm_zphs_puttagunta", hmPass:"hm123" },
  { id:"SCH103", name:"ZPHS LAKSHMI NARASIMHA PURAM", hmName:"HM", hmUser:"hm_zphs_lakshminarasimhapuram", hmPass:"hm123" },
  { id:"SCH108", name:"ZPHS BHATLA PENUMARRU", hmName:"HM", hmUser:"hm_zphs_penumarru", hmPass:"hm123" },
  { id:"SCH109", name:"ZPHS CHALLAPALLI", hmName:"HM", hmUser:"hm_zphs_challapalli", hmPass:"hm123" },
  { id:"SCH110", name:"ZPHS GOGINENIPALEM", hmName:"HM", hmUser:"hm_zphs_goginenupalem", hmPass:"hm123" },
  { id:"SCH111", name:"ZPHS GHANTASALA", hmName:"HM", hmUser:"hm_zphs_ghantasala", hmPass:"hm123" },
  { id:"SCH112", name:"ZPHS KOSURU", hmName:"HM", hmUser:"hm_zphs_kosuru", hmPass:"hm123" },
  { id:"SCH113", name:"ZPHS KAZA", hmName:"HM", hmUser:"hm_zphs_kaza", hmPass:"hm123" },
  { id:"SCH114", name:"SS ZPHS KUCHIPUDI", hmName:"HM", hmUser:"hm_zphs_sskuchipudi", hmPass:"hm123" },
  { id:"SCH115", name:"ZPHS KODALI", hmName:"HM", hmUser:"hm_zphs_kodali", hmPass:"hm123" },
  { id:"SCH116", name:"ZPHS MOVVA", hmName:"HM", hmUser:"hm_zphs_movva", hmPass:"hm123" },
  { id:"SCH117", name:"ZPHS PURITIGADDA", hmName:"HM", hmUser:"hm_zphs_puritigadda", hmPass:"hm123" },
  { id:"SCH118", name:"ZPHS PEDASANAGALLU", hmName:"HM", hmUser:"hm_zphs_pedasanagallu", hmPass:"hm123" },
  { id:"SCH119", name:"ZPHS SRIKAKULAM", hmName:"HM", hmUser:"hm_zphs_srikakulam", hmPass:"hm123" },
  { id:"SCH120", name:"ZPHS VAKKALAGADDA", hmName:"HM", hmUser:"hm_zphs_vakkalagadda", hmPass:"hm123" },
  { id:"SCH121", name:"ZPHS LANKAPALLE", hmName:"HM", hmUser:"hm_zphs_lankapalle", hmPass:"hm123" },
  { id:"SCH125", name:"ZPHS BAPULAPADU", hmName:"HM", hmUser:"hm_zphs_bapulapadu", hmPass:"hm123" },
  { id:"SCH126", name:"ZPHS REMALLE", hmName:"HM", hmUser:"hm_zphs_remalle", hmPass:"hm123" },
  { id:"SCH128", name:"ZPHS ADDADA", hmName:"HM", hmUser:"hm_zphs_addada", hmPass:"hm123" },
  { id:"SCH129", name:"ZPHS ZAMIGOLVEPALLI", hmName:"HM", hmUser:"hm_zphs_zamigolvepalli", hmPass:"hm123" },
  { id:"SCH130", name:"ZPHS ZAMIDAGGUMILLI", hmName:"HM", hmUser:"hm_zphs_zamidaggumilli", hmPass:"hm123" },
  { id:"SCH131", name:"ZPHS KANUMURU", hmName:"HM", hmUser:"hm_zphs_kanumuru", hmPass:"hm123" },
  { id:"SCH132", name:"ZPHS KOTHANIMMAKURU", hmName:"HM", hmUser:"hm_zphs_kothanimmakuru", hmPass:"hm123" },
  { id:"SCH133", name:"ZPHS PAMMARU", hmName:"HM", hmUser:"hm_zphs_pamarru", hmPass:"hm123" },
  { id:"SCH134", name:"ZPHS PASUMARRU", hmName:"HM", hmUser:"hm_zphs_pasumarru", hmPass:"hm123" },
  { id:"SCH136", name:"ZPHS EDUPUGALLU", hmName:"HM", hmUser:"hm_zphs_edupugallu", hmPass:"hm123" },
  { id:"SCH137", name:"ZPHS KANKIPADU", hmName:"HM", hmUser:"hm_zphs_kankipadu", hmPass:"hm123" },
  { id:"SCH138", name:"ZPHS KOLAVENNU", hmName:"HM", hmUser:"hm_zphs_kolavennu", hmPass:"hm123" },
  { id:"SCH139", name:"ZPHS MUSTABADA", hmName:"HM", hmUser:"hm_zphs_mustabada", hmPass:"hm123" },
  { id:"SCH140", name:"ZPHS PENAMALURU", hmName:"HM", hmUser:"hm_zphs_penamaluru", hmPass:"hm123" },
  { id:"SCH141", name:"ZPHS PORANKI", hmName:"HM", hmUser:"hm_zphs_poranki", hmPass:"hm123" },
  { id:"SCH142", name:"ZPHS PUNADIPADU", hmName:"HM", hmUser:"hm_zphs_punadipadu", hmPass:"hm123" },
  { id:"SCH143", name:"ZPHS TENNERU", hmName:"HM", hmUser:"hm_zphs_tenneru", hmPass:"hm123" },
  { id:"SCH144", name:"ZPHS KANURU", hmName:"HM", hmUser:"hm_zphs_kanuru", hmPass:"hm123" },
  { id:"SCH145", name:"ZPHS TADIGADAPA", hmName:"HM", hmUser:"hm_zphs_tadigadapa", hmPass:"hm123" },
  { id:"SCH146", name:"ZPHS VANUKURU", hmName:"HM", hmUser:"hm_zphs_vanukuru", hmPass:"hm123" },
  { id:"SCH147", name:"ZPHS YANAMALAKUDURU", hmName:"HM", hmUser:"hm_zphs_yanamalakuduru", hmPass:"hm123" },
  { id:"SCH149", name:"GOVT HIGH SCHOOL AKUNURU", hmName:"HM", hmUser:"hm_ghs_akunuru", hmPass:"hm123" },
  { id:"SCH150", name:"ZPHS AGINIPARRU", hmName:"HM", hmUser:"hm_zphs_aginiparru", hmPass:"hm123" },
  { id:"SCH151", name:"ZPHS CHORAGUDI", hmName:"HM", hmUser:"hm_zphs_choragudi", hmPass:"hm123" },
  { id:"SCH152", name:"ZPHS GODAVARRU", hmName:"HM", hmUser:"hm_zphs_godavarru", hmPass:"hm123" },
  { id:"SCH153", name:"ZPHS INAPURU", hmName:"HM", hmUser:"hm_zphs_inapuru", hmPass:"hm123" },
  { id:"SCH154", name:"ZPHS INDUPALLI", hmName:"HM", hmUser:"hm_zphs_indupalli", hmPass:"hm123" },
  { id:"SCH155", name:"ZPHS KATURU", hmName:"HM", hmUser:"hm_zphs_katuru", hmPass:"hm123" },
  { id:"SCH156", name:"ZPHS KALAVAPAMULA", hmName:"HM", hmUser:"hm_zphs_kalavapamula", hmPass:"hm123" },
  { id:"SCH157", name:"ZPHS KAPILESWARAPURAM", hmName:"HM", hmUser:"hm_zphs_kapileswarapuram", hmPass:"hm123" },
  { id:"SCH158", name:"ZPHS MEDURU", hmName:"HM", hmUser:"hm_zphs_meduru", hmPass:"hm123" },
  { id:"SCH159", name:"ZPHS MUDUNURU", hmName:"HM", hmUser:"hm_zphs_mudunuru", hmPass:"hm123" },
  { id:"SCH160", name:"ZPHS PENAMAKURU", hmName:"HM", hmUser:"hm_zphs_penamakuru", hmPass:"hm123" },
  { id:"SCH161", name:"ZPHS PAMIDIMUKKALA", hmName:"HM", hmUser:"hm_zphs_pamidimukkala", hmPass:"hm123" },
  { id:"SCH162", name:"ZPHS PRODDUTURU", hmName:"HM", hmUser:"hm_zphs_prodduturu", hmPass:"hm123" },
  { id:"SCH163", name:"ZPHS PEDAOGIRALA", hmName:"HM", hmUser:"hm_zphs_pedaogirala", hmPass:"hm123" },
  { id:"SCH164", name:"ZPHS TADANKI", hmName:"HM", hmUser:"hm_zphs_tadanki", hmPass:"hm123" },
  { id:"SCH165", name:"ZPHS THOTLAVALLURU", hmName:"HM", hmUser:"hm_zphs_thotlavalluru", hmPass:"hm123" },
  { id:"SCH166", name:"ZPHS VUYYURU", hmName:"HM", hmUser:"hm_zphs_vuyyuru", hmPass:"hm123" },
  { id:"SCH167", name:"ZPHS VALLURUPALEM", hmName:"HM", hmUser:"hm_zphs_vallurupalem", hmPass:"hm123" },
  { id:"SCH168", name:"ZPHS NEPPALLI", hmName:"HM", hmUser:"hm_zphs_neppalli", hmPass:"hm123" },
  { id:"SCH173", name:"MHS BANDARKOTA", hmName:"HM", hmUser:"hm_mhs_bandarkota", hmPass:"hm123" },
  { id:"SCH174", name:"MHS DESAIPET", hmName:"HM", hmUser:"hm_mhs_desaipet", hmPass:"hm123" },
  { id:"SCH175", name:"MHS RUSTUMBADA BOYS", hmName:"HM", hmUser:"hm_mhs_boysrustumbada", hmPass:"hm123" },
  { id:"SCH176", name:"MGHS RUSTUMBADAPARK", hmName:"HM", hmUser:"hm_mghs_rustumbadapark", hmPass:"hm123" },
  { id:"SCH177", name:"GVNR MHS KALKHANPET", hmName:"HM", hmUser:"hm_gvnr_mhs_kalkhanpet", hmPass:"hm123" },
  { id:"SCH178", name:"CP MHS CHILAKALPUDI", hmName:"HM", hmUser:"hm_cp_mhs_chilakalpudi", hmPass:"hm123" },
  { id:"SCH179", name:"MHS GILAKALADINDI", hmName:"HM", hmUser:"hm_mhs_gilakaladindi", hmPass:"hm123" },
  { id:"SCH180", name:"ZPHS KONA", hmName:"HM", hmUser:"hm_zphs_kona", hmPass:"hm123" },
  { id:"SCH181", name:"ZPHS PALLETUMMALAPA", hmName:"HM", hmUser:"hm_zphs_palletummalapa", hmPass:"hm123" },
  { id:"SCH182", name:"ZPHS NANDAMURU", hmName:"HM", hmUser:"hm_zphs_nandamuru", hmPass:"hm123" },
  { id:"SCH183", name:"ZPHS THOTAMULA", hmName:"HM", hmUser:"hm_zphs_thotamula", hmPass:"hm123" },
  { id:"SCH184", name:"SPL MPL HS RAILPETA", hmName:"HM", hmUser:"hm_spl_mpl_hs_railpeta", hmPass:"hm123" },
  { id:"SCH185", name:"ZPHS CHEVENDRA", hmName:"HM", hmUser:"hm_zphs_chevendra", hmPass:"hm123" },
  { id:"SCH186", name:"ZPHS POLAVARAM", hmName:"HM", hmUser:"hm_zphs_polavaram", hmPass:"hm123" },
  { id:"SCH187", name:"SPL MPL HS RAJUPETA", hmName:"HM", hmUser:"hm_spl_mpl_hs_rajupeta", hmPass:"hm123" },
  { id:"SCH188", name:"ZPHS KODURU", hmName:"HM", hmUser:"hm_zphs_koduru", hmPass:"hm123" },
  { id:"SCH189", name:"ZPHS EDURUMONDI", hmName:"HM", hmUser:"hm_zphs_edurumondi", hmPass:"hm123" },
  { id:"SCH190", name:"ZPHS URLAGONDITIPPA", hmName:"HM", hmUser:"hm_zphs_urlagonditippa", hmPass:"hm123" },
  { id:"SCH191", name:"ZPHS MALLAVLLI", hmName:"HM", hmUser:"hm_zphs_mallavlli", hmPass:"hm123" },
  { id:"SCH192", name:"ZPHS SUREMPALLI", hmName:"HM", hmUser:"hm_zphs_surempalli", hmPass:"hm123" },
  { id:"SCH193", name:"ZPHS KESARAPALLI", hmName:"HM", hmUser:"hm_zphs_kesarapalli", hmPass:"hm123" },
  { id:"SCH194", name:"ZPHS POTTIPADU", hmName:"HM", hmUser:"hm_zphs_pottipadu", hmPass:"hm123" },
  { id:"SCH195", name:"AN MPL HIGH SCHOOL", hmName:"HM", hmUser:"hm_an_mpl_high_school", hmPass:"hm123" },
  { id:"SCH196", name:"AGK MPL HIGH SCHOOL", hmName:"HM", hmUser:"hm_agk_mpl_high_school", hmPass:"hm123" },
  { id:"SCH197", name:"AKTP MPL HIGHSCHOOL", hmName:"HM", hmUser:"hm_aktp_mpl_highschool", hmPass:"hm123" },
  { id:"SCH198", name:"G MPL HIGH SCHOOL", hmName:"HM", hmUser:"hm_g_mpl_high_school", hmPass:"hm123" },
  { id:"SCH199", name:"SPS MPL HIGH SCHOOL", hmName:"HM", hmUser:"hm_sps_mpl_high_school", hmPass:"hm123" },
  { id:"SCH200", name:"SGVSG MHS", hmName:"HM", hmUser:"hm_sgvsg_mhs", hmPass:"hm123" },
  { id:"SCH201", name:"ZPHS POLUKONDA", hmName:"HM", hmUser:"hm_zphs_polukonda", hmPass:"hm123" },
  { id:"SCH202", name:"SGRK GOVT HS GUDIVA", hmName:"HM", hmUser:"hm_sgrk_govt_hs_gudiva", hmPass:"hm123" },
  { id:"SCH203", name:"ZPHS GUDLAVALLERU-1", hmName:"HM", hmUser:"hm_zphs_gudlavalleru", hmPass:"hm123" },
  { id:"SCH204", name:"ZPHS MADDURU", hmName:"HM", hmUser:"hm_zphs_madduru", hmPass:"hm123" },
  { id:"SCH205", name:"ZPHS GARIKAPARRU", hmName:"HM", hmUser:"hm_zphs_garikaparru", hmPass:"hm123" },
];

function uid() { return Math.random().toString(36).slice(2,9); }
function calcPct(o, m) { return m > 0 ? Math.round((o / m) * 100) : 0; }
function useToast() {
  const [msg, setMsg] = useState("");
  function show(m) { setMsg(m); setTimeout(() => setMsg(""), 2500); }
  return [msg, show];
}

function studentsCol(schId) { return collection(db, "schools", schId, "students"); }
function slipTestsCol(schId) { return collection(db, "schools", schId, "slipTests"); }
function marksCol(schId) { return collection(db, "schools", schId, "marks"); }
function markDocId(stId, stuId) { return stId + "__" + stuId; }

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#eef2fa;--card:#fff;--p:#1e40af;--p2:#1d4ed8;--acc:#f59e0b;--red:#ef4444;--green:#16a34a;--text:#0f172a;--sub:#64748b;--border:#e2e8f0;--sh:0 2px 16px rgba(30,64,175,.09);--r:16px}
body{font-family:'Sora',sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
.app{max-width:430px;margin:0 auto;min-height:100vh;background:var(--bg);position:relative}
.lbg{min-height:100vh;background:linear-gradient(150deg,#1e3a8a,#1d4ed8 60%,#1e40af);display:flex;align-items:center;justify-content:center;padding:24px;overflow:hidden;position:relative}
.lbg::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 75% 15%,rgba(251,191,36,.22) 0%,transparent 55%),radial-gradient(ellipse at 15% 85%,rgba(96,165,250,.18) 0%,transparent 55%);pointer-events:none}
.lcard{background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.18);border-radius:28px;padding:36px 26px;width:100%;backdrop-filter:blur(18px);position:relative;z-index:1}
.logo{width:70px;height:70px;background:var(--acc);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto 18px;box-shadow:0 8px 28px rgba(245,158,11,.45)}
.ltitle{font-size:23px;font-weight:800;color:#fff;text-align:center}
.lsub{color:rgba(255,255,255,.5);text-align:center;font-size:13px;margin:5px 0 24px}
.fld{margin-bottom:13px}
.fld label{display:block;font-size:11px;font-weight:700;color:rgba(255,255,255,.6);margin-bottom:5px;letter-spacing:.6px;text-transform:uppercase}
.fld input,.fld select{width:100%;padding:13px 15px;background:rgba(255,255,255,.10);border:1.5px solid rgba(255,255,255,.18);border-radius:13px;color:#fff;font-size:15px;outline:none;font-family:'Sora',sans-serif}
.fld input::placeholder{color:rgba(255,255,255,.3)}
.fld input:focus,.fld select:focus{border-color:var(--acc)}
.fld select option{background:#1e3a8a;color:#fff}
.lbtn{width:100%;padding:15px;background:linear-gradient(135deg,var(--acc),#d97706);border:none;border-radius:14px;color:#fff;font-size:16px;font-weight:800;cursor:pointer;margin-top:8px;font-family:'Sora',sans-serif}
.lerr{color:#fca5a5;font-size:13px;text-align:center;margin-top:11px;font-weight:600}
.hdr{background:linear-gradient(135deg,var(--p),#1e3a8a);padding:14px 16px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:200}
.hdr-l{display:flex;align-items:center;gap:10px}
.hdr-title{font-size:16px;font-weight:800;color:#fff;line-height:1.1}
.hdr-sub{font-size:11px;color:rgba(255,255,255,.55)}
.hbtn{background:rgba(255,255,255,.14);border:none;border-radius:10px;color:rgba(255,255,255,.85);padding:8px 13px;font-size:12px;font-weight:700;cursor:pointer;font-family:'Sora',sans-serif}
.page{padding:14px;padding-bottom:84px}
.sec{font-size:11px;font-weight:800;color:var(--sub);letter-spacing:.8px;text-transform:uppercase;margin:14px 0 8px}
.card{background:var(--card);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden}
.dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px}
.dash-tile{background:var(--card);border-radius:18px;box-shadow:var(--sh);padding:20px 16px;cursor:pointer;transition:transform .15s}
.dash-tile:active{transform:scale(.97)}
.tile-icon{font-size:26px;margin-bottom:8px}
.tile-num{font-family:'JetBrains Mono',monospace;font-size:32px;font-weight:700;line-height:1;color:var(--p)}
.tile-num.amber{color:#b45309}
.tile-lbl{font-size:12px;font-weight:700;color:var(--sub);margin-top:4px}
.tile-hint{font-size:10px;color:#94a3b8;margin-top:2px}
.avg-tile{background:var(--card);border-radius:18px;box-shadow:var(--sh);padding:18px 16px;display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.avg-num{font-family:'JetBrains Mono',monospace;font-size:36px;font-weight:700;color:var(--p);line-height:1.1}
.pbar-wrap{height:8px;background:var(--border);border-radius:99px;overflow:hidden;margin-top:10px}
.pbar-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,var(--p),var(--p2));transition:width .6s}
.bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:#fff;border-top:1px solid var(--border);display:flex;padding:8px 0 14px;z-index:180}
.bni{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:6px 0}
.bni-icon{font-size:20px}
.bni-lbl{font-size:10px;font-weight:700;letter-spacing:.3px}
.fab{position:fixed;bottom:76px;right:calc(50% - 215px + 14px);width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,var(--p),var(--p2));border:none;color:#fff;font-size:26px;cursor:pointer;box-shadow:0 6px 20px rgba(30,64,175,.38);display:flex;align-items:center;justify-content:center;z-index:150}
.overlay{position:fixed;inset:0;background:rgba(15,23,42,.5);z-index:300;display:flex;align-items:flex-end;justify-content:center;animation:fIn .2s}
@keyframes fIn{from{opacity:0}to{opacity:1}}
.sheet{background:#fff;border-radius:24px 24px 0 0;padding:22px 18px 36px;width:100%;max-width:430px;max-height:92vh;overflow-y:auto;animation:sUp .25s cubic-bezier(.32,.72,0,1)}
@keyframes sUp{from{transform:translateY(60px);opacity:0}to{transform:translateY(0);opacity:1}}
.sh-title{font-size:17px;font-weight:800;color:var(--text);margin-bottom:18px;display:flex;justify-content:space-between;align-items:center}
.sh-close{background:var(--bg);border:none;border-radius:9px;padding:6px 11px;font-size:13px;cursor:pointer;font-weight:700;color:var(--sub);font-family:'Sora',sans-serif}
.lf{margin-bottom:13px}
.lf label{display:block;font-size:11px;font-weight:700;color:var(--sub);margin-bottom:5px;letter-spacing:.5px;text-transform:uppercase}
.lf input,.lf select{width:100%;padding:12px 13px;background:var(--bg);border:1.5px solid var(--border);border-radius:12px;font-size:15px;outline:none;color:var(--text);font-family:'Sora',sans-serif}
.lf input:focus,.lf select:focus{border-color:var(--p);background:#fff}
.subj-max-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);gap:10px}
.subj-max-row:last-child{border-bottom:none}
.subj-check{display:flex;align-items:center;gap:8px;flex:1;cursor:pointer;font-size:14px;font-weight:600;color:var(--sub);user-select:none}
.subj-check.on{color:var(--p)}
.chk-box{width:20px;height:20px;border-radius:6px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;transition:all .15s}
.chk-box.on{background:var(--p);border-color:var(--p);color:#fff}
.max-inp{width:64px;padding:8px;text-align:center;border:1.5px solid var(--border);border-radius:10px;font-family:'JetBrains Mono',monospace;font-size:16px;font-weight:700;color:var(--p);background:var(--bg);outline:none}
.max-inp:focus{border-color:var(--acc);background:#fffbeb}
.max-inp:disabled{opacity:.3;cursor:not-allowed}
.pbtn{width:100%;padding:15px;background:linear-gradient(135deg,var(--p),var(--p2));border:none;border-radius:14px;color:#fff;font-size:15px;font-weight:800;cursor:pointer;font-family:'Sora',sans-serif;margin-top:6px}
.pbtn:disabled{opacity:.45;cursor:not-allowed}
.dbtn{background:linear-gradient(135deg,var(--red),#b91c1c)!important}
.gbtn{background:linear-gradient(135deg,var(--green),#15803d)!important}
.btn-row{display:flex;gap:8px;margin-top:6px}
.btn-row .pbtn{margin-top:0}
.back{display:flex;align-items:center;gap:5px;background:none;border:none;color:var(--p);font-size:14px;font-weight:700;cursor:pointer;padding:12px 14px 4px;font-family:'Sora',sans-serif}
.lrow{display:flex;align-items:center;padding:13px 15px;border-bottom:1px solid var(--border);gap:8px}
.lrow:last-child{border-bottom:none}
.lrow-info{flex:1}
.lrow-name{font-size:15px;font-weight:700;color:var(--text)}
.lrow-sub{font-size:12px;color:var(--sub);margin-top:1px}
.icon-btn{background:none;border:none;font-size:17px;cursor:pointer;padding:5px;border-radius:8px}
.st-card{background:var(--card);border-radius:var(--r);box-shadow:var(--sh);padding:15px;margin-bottom:10px}
.st-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px}
.st-name{font-size:16px;font-weight:800;color:var(--text)}
.st-date{font-size:11px;color:var(--sub);margin-top:2px}
.st-tags{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px}
.st-tag{background:#eff6ff;color:var(--p);font-size:11px;font-weight:700;padding:3px 9px;border-radius:8px}
.me-student-card{background:var(--card);border-radius:14px;box-shadow:var(--sh);margin-bottom:10px;overflow:hidden}
.me-stu-header{display:flex;align-items:center;justify-content:space-between;padding:13px 15px;background:#f8faff;border-bottom:1px solid var(--border);cursor:pointer}
.me-stu-name{font-size:15px;font-weight:800;color:var(--text)}
.me-stu-meta{font-size:12px;color:var(--sub)}
.me-body{padding:12px 15px}
.me-row{display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border)}
.me-row:last-child{border-bottom:none}
.me-subj{font-size:13px;font-weight:700;color:var(--text);flex:1}
.me-max{font-size:11px;color:var(--sub);width:36px;text-align:center}
.me-inp{width:60px;padding:7px;text-align:center;border:2px solid var(--border);border-radius:10px;font-family:'JetBrains Mono',monospace;font-size:17px;font-weight:700;color:var(--p);background:var(--bg);outline:none}
.me-inp:focus{border-color:var(--acc);background:#fffbeb}
.absent-toggle{display:flex;align-items:center;gap:8px;padding:8px 0;margin-bottom:4px}
.abs-btn{padding:7px 14px;border-radius:10px;border:2px solid var(--border);font-size:12px;font-weight:700;cursor:pointer;font-family:'Sora',sans-serif;background:var(--bg);color:var(--sub)}
.abs-btn.on{border-color:var(--red);background:#fef2f2;color:var(--red)}
.pf-row{display:flex;gap:8px;margin-top:8px}
.pf-btn{flex:1;padding:9px;border-radius:11px;border:2px solid var(--border);font-size:13px;font-weight:800;cursor:pointer;font-family:'Sora',sans-serif;background:var(--bg);color:var(--sub)}
.pf-btn.pass{border-color:var(--green);background:#f0fdf4;color:var(--green)}
.pf-btn.fail{border-color:var(--red);background:#fef2f2;color:var(--red)}
.toast{position:fixed;bottom:88px;left:50%;transform:translateX(-50%);background:#0f172a;color:#fff;padding:11px 22px;border-radius:13px;font-size:13px;font-weight:700;z-index:500;white-space:nowrap;box-shadow:0 8px 24px rgba(0,0,0,.22);animation:tIn .3s,tOut .3s 2.1s forwards}
@keyframes tIn{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
@keyframes tOut{to{opacity:0;pointer-events:none}}
.empty{text-align:center;padding:40px 20px;color:var(--sub)}
.empty-icon{font-size:42px;margin-bottom:8px}
.empty-txt{font-size:14px;font-weight:700}
.empty-hint{font-size:12px;margin-top:3px;color:#94a3b8}
.clickable-row{cursor:pointer;transition:background .15s}
.clickable-row:active{background:var(--bg)}
.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:800;color:#fff}
.pass-badge{background:var(--green)}
.fail-badge{background:var(--red)}
.abs-badge{background:#94a3b8}
.loading{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;gap:12px;color:var(--sub)}
.spinner{width:40px;height:40px;border:4px solid var(--border);border-top-color:var(--p);border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.search-box{width:100%;padding:11px 14px;background:var(--card);border:1.5px solid var(--border);border-radius:13px;font-size:15px;outline:none;color:var(--text);font-family:'Sora',sans-serif;margin-bottom:12px;box-shadow:var(--sh)}
.search-box:focus{border-color:var(--p)}
`;

// ─── Login ────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [selSchool, setSelSchool] = useState(null);

  const filtered = SCHOOLS.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  function go() {
    if (!selSchool) { setErr("Please select a school"); return; }
    if (selSchool.hmUser === user && selSchool.hmPass === pass) onLogin({ school: selSchool });
    else setErr("Wrong username or password");
  }

  return (
    <div className="lbg">
      <div className="lcard">
        <div className="logo">📋</div>
        <div className="ltitle">Slip Test Manager</div>
        <div className="lsub">10th Class · HM Portal</div>
        <div className="fld">
          <label>Search & Select School</label>
          <input
            className="search-box"
            style={{background:"rgba(255,255,255,.10)",border:"1.5px solid rgba(255,255,255,.18)",color:"#fff",borderRadius:13,padding:"12px 14px",fontSize:14,outline:"none",fontFamily:"Sora,sans-serif",marginBottom:6}}
            placeholder="Type school name…"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelSchool(null); }}
          />
          {query.length > 0 && !selSchool && (
            <div style={{background:"rgba(255,255,255,.95)",borderRadius:13,maxHeight:180,overflowY:"auto",marginBottom:8}}>
              {filtered.length === 0 && <div style={{padding:"12px 14px",color:"var(--sub)",fontSize:13}}>No schools found</div>}
              {filtered.map(s => (
                <div key={s.id} onClick={() => { setSelSchool(s); setQuery(s.name); }}
                  style={{padding:"11px 14px",cursor:"pointer",borderBottom:"1px solid var(--border)",fontSize:13,fontWeight:600,color:"var(--text)"}}>
                  {s.name}
                </div>
              ))}
            </div>
          )}
          {selSchool && <div style={{background:"rgba(255,255,255,.15)",borderRadius:10,padding:"8px 12px",fontSize:12,color:"rgba(255,255,255,.9)",fontWeight:600,marginBottom:8}}>✓ {selSchool.name}</div>}
        </div>
        <div className="fld">
          <label>Username</label>
          <input placeholder="Enter username" value={user} onChange={e => setUser(e.target.value)} />
        </div>
        <div className="fld">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && go()} />
        </div>
        <button className="lbtn" onClick={go}>Login →</button>
        {err && <div className="lerr">⚠ {err}</div>}
      </div>
    </div>
  );
}

function StudentModal({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || "");
  const [roll, setRoll] = useState(initial?.rollNo || "");
  const [gender, setGender] = useState(initial?.gender || "Male");
  function save() { if (!name.trim() || !roll.trim()) return; onSave({ name: name.trim(), rollNo: roll.trim(), gender }); }
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sh-title">{initial ? "Edit Student" : "Add Student"}<button className="sh-close" onClick={onClose}>✕</button></div>
        <div className="lf"><label>Full Name</label><input placeholder="Student full name" value={name} onChange={e => setName(e.target.value)} /></div>
        <div className="lf"><label>Roll Number</label><input placeholder="e.g. 101" value={roll} onChange={e => setRoll(e.target.value)} /></div>
        <div className="lf"><label>Gender</label>
          <select value={gender} onChange={e => setGender(e.target.value)}>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
        </div>
        <button className="pbtn" onClick={save}>💾 Save Student</button>
      </div>
    </div>
  );
}

function SlipTestModal({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || "");
  const [date, setDate] = useState(initial?.date || new Date().toISOString().slice(0, 10));
  const [subjects, setSubjects] = useState(
    initial?.subjects
      ? ALL_SUBJECTS.map(s => { const f = initial.subjects.find(x => x.subj === s); return { subj: s, selected: !!f, maxMarks: f?.maxMarks || "" }; })
      : ALL_SUBJECTS.map(s => ({ subj: s, selected: false, maxMarks: "" }))
  );
  function toggleSubj(i) { setSubjects(p => p.map((s, idx) => idx === i ? { ...s, selected: !s.selected } : s)); }
  function setMax(i, val) { setSubjects(p => p.map((s, idx) => idx === i ? { ...s, maxMarks: val } : s)); }
  const selected = subjects.filter(s => s.selected);
  const valid = name.trim() && selected.length > 0 && selected.every(s => s.maxMarks !== "" && Number(s.maxMarks) > 0);
  function save() {
    if (!valid) return;
    onSave({ name: name.trim(), date, subjects: subjects.filter(s => s.selected).map(s => ({ subj: s.subj, maxMarks: Number(s.maxMarks) })) });
  }
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sh-title">{initial ? "Edit Slip Test" : "New Slip Test"}<button className="sh-close" onClick={onClose}>✕</button></div>
        <div className="lf"><label>Test Name</label><input placeholder="e.g. ST-1, Unit Test 2…" value={name} onChange={e => setName(e.target.value)} /></div>
        <div className="lf"><label>Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
        <div className="lf">
          <label>Subjects & Max Marks</label>
          {subjects.map((s, i) => (
            <div className="subj-max-row" key={s.subj}>
              <div className={"subj-check" + (s.selected ? " on" : "")} onClick={() => toggleSubj(i)}>
                <div className={"chk-box" + (s.selected ? " on" : "")}>{s.selected ? "✓" : ""}</div>
                {s.subj}
              </div>
              <input className="max-inp" type="number" min="1" placeholder="Max" disabled={!s.selected}
                value={s.maxMarks} onChange={e => setMax(i, e.target.value)} />
            </div>
          ))}
        </div>
        <button className="pbtn" onClick={save} disabled={!valid}>
          {!name.trim() ? "Enter test name" : selected.length === 0 ? "Select at least 1 subject" : !selected.every(s => s.maxMarks) ? "Enter max marks" : "💾 Save Slip Test"}
        </button>
      </div>
    </div>
  );
}

function Confirm({ title, msg, onConfirm, onClose }) {
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sh-title">{title}<button className="sh-close" onClick={onClose}>✕</button></div>
        <p style={{ fontSize: 14, color: "var(--sub)", marginBottom: 18 }}>{msg}</p>
        <div className="btn-row">
          <button className="pbtn" style={{ background: "var(--bg)", color: "var(--sub)" }} onClick={onClose}>Cancel</button>
          <button className="pbtn dbtn" onClick={onConfirm}>Confirm Delete</button>
        </div>
      </div>
    </div>
  );
}

function MarkEntry({ school, slipTest, students, marks, onMarkChange, onBack, toast, showToast }) {
  const [expanded, setExpanded] = useState(students[0]?.id || null);
  function getEntry(sid) { return marks[sid] || { absent: false, pass: null, scores: {} }; }
  function update(sid, patch) { onMarkChange(sid, { ...getEntry(sid), ...patch }); }
  function setScore(sid, subj, val) { const e = getEntry(sid); update(sid, { scores: { ...e.scores, [subj]: val } }); }
  function getTotalObtained(sid) {
    const e = getEntry(sid);
    return slipTest.subjects.reduce((a, s) => { const v = e.scores?.[s.subj]; return a + (v !== "" && v !== undefined ? Number(v) : 0); }, 0);
  }
  const totalMax = slipTest.subjects.reduce((a, s) => a + s.maxMarks, 0);
  const saved = students.filter(s => { const e = getEntry(s.id); return e.absent || e.pass !== null || Object.keys(e.scores || {}).length > 0; }).length;

  if (students.length === 0) return (
    <div className="app">
      <div className="hdr"><div className="hdr-l"><span style={{ fontSize: 20 }}>📝</span><div><div className="hdr-title">{slipTest.name}</div></div></div></div>
      <button className="back" onClick={onBack}>← Back</button>
      <div className="empty"><div className="empty-icon">👥</div><div className="empty-txt">No students — add students first</div></div>
    </div>
  );

  return (
    <div className="app">
      <div className="hdr">
        <div className="hdr-l">
          <span style={{ fontSize: 20 }}>📝</span>
          <div><div className="hdr-title">{slipTest.name}</div><div className="hdr-sub">{school.name} · Max {totalMax}</div></div>
        </div>
      </div>
      <button className="back" onClick={onBack}>← Back</button>
      <div className="page" style={{ paddingTop: 0 }}>
        <div style={{ fontSize: 12, color: "var(--sub)", marginBottom: 10, fontWeight: 600 }}>{saved}/{students.length} students filled</div>
        {students.map(s => {
          const e = getEntry(s.id);
          const obtained = getTotalObtained(s.id);
          const isOpen = expanded === s.id;
          return (
            <div className="me-student-card" key={s.id}>
              <div className="me-stu-header" onClick={() => setExpanded(isOpen ? null : s.id)}>
                <div>
                  <div className="me-stu-name">{s.rollNo}. {s.name}</div>
                  <div className="me-stu-meta">{s.gender} · {isOpen ? "tap to collapse" : "tap to expand"}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {e.absent && <span className="badge abs-badge">Absent</span>}
                  {!e.absent && e.pass === true && <span className="badge pass-badge">Pass</span>}
                  {!e.absent && e.pass === false && <span className="badge fail-badge">Fail</span>}
                  {!e.absent && obtained > 0 && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 13, color: "var(--p)" }}>{obtained}/{totalMax}</span>}
                  <span style={{ color: "var(--sub)", fontSize: 16 }}>{isOpen ? "▲" : "▼"}</span>
                </div>
              </div>
              {isOpen && (
                <div className="me-body">
                  <div className="absent-toggle">
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--sub)" }}>Status:</span>
                    <button className={"abs-btn" + (e.absent ? " on" : "")} onClick={() => update(s.id, { absent: !e.absent, scores: {}, pass: null })}>
                      {e.absent ? "✓ Absent" : "Mark Absent"}
                    </button>
                  </div>
                  {!e.absent && slipTest.subjects.map(sub => (
                    <div className="me-row" key={sub.subj}>
                      <div className="me-subj">{sub.subj}</div>
                      <div className="me-max">/{sub.maxMarks}</div>
                      <input className="me-inp" type="number" min="0" max={sub.maxMarks} placeholder="—"
                        value={e.scores?.[sub.subj] ?? ""}
                        onChange={ev => { const v = ev.target.value === "" ? "" : Math.min(sub.maxMarks, Math.max(0, Number(ev.target.value))); setScore(s.id, sub.subj, v); }} />
                    </div>
                  ))}
                  {!e.absent && (
                    <div className="pf-row">
                      <button className={"pf-btn" + (e.pass === true ? " pass" : "")} onClick={() => update(s.id, { pass: e.pass === true ? null : true })}>✓ Pass</button>
                      <button className={"pf-btn" + (e.pass === false ? " fail" : "")} onClick={() => update(s.id, { pass: e.pass === false ? null : false })}>✗ Fail</button>
                    </div>
                  )}
                  <button className="pbtn gbtn" style={{ marginTop: 10, padding: "10px", fontSize: 13 }}
                    onClick={() => { setExpanded(null); showToast("✅ Saved — " + s.name); }}>
                    ✓ Done with this student
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function Dashboard({ school, students, slipTests, allMarks }) {
  const [view, setView] = useState(null);
  const [subView, setSubView] = useState(null);
  const totalTests = slipTests.length;
  const totalStudents = students.length;
  let grandObtained = 0, grandMax = 0;
  slipTests.forEach(st => {
    const stMarks = allMarks[st.id] || {};
    const stMax = st.subjects.reduce((a, s) => a + s.maxMarks, 0);
    students.forEach(s => {
      const e = stMarks[s.id]; if (!e || e.absent) return;
      grandMax += stMax;
      st.subjects.forEach(sub => { const v = e.scores?.[sub.subj]; if (v !== "" && v !== undefined) grandObtained += Number(v); });
    });
  });
  const overallAvg = grandMax > 0 ? calcPct(grandObtained, grandMax) : null;

  if (view === "tests" && !subView) {
    return (
      <div>
        <button className="back" onClick={() => setView(null)}>← Dashboard</button>
        <div style={{ padding: "0 14px 14px" }}>
          <div className="sec">All Slip Tests ({totalTests})</div>
          {slipTests.length === 0 && <div className="empty"><div className="empty-icon">📋</div><div className="empty-txt">No slip tests yet</div></div>}
          {slipTests.map(st => {
            const stMarks = allMarks[st.id] || {};
            const stMax = st.subjects.reduce((a, s) => a + s.maxMarks, 0);
            let tot = 0, mx = 0, pass = 0, fail = 0, absent = 0;
            students.forEach(s => {
              const e = stMarks[s.id]; if (!e) return;
              if (e.absent) { absent++; return; }
              if (e.pass === true) pass++;
              if (e.pass === false) fail++;
              mx += stMax;
              st.subjects.forEach(sub => { const v = e.scores?.[sub.subj]; if (v !== "" && v !== undefined) tot += Number(v); });
            });
            const avg = mx > 0 ? calcPct(tot, mx) : null;
            return (
              <div className="st-card clickable-row" key={st.id} onClick={() => setSubView(st)}>
                <div className="st-top">
                  <div><div className="st-name">{st.name}</div><div className="st-date">📅 {st.date}</div></div>
                  {avg !== null && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 18, color: "var(--p)" }}>{avg}%</span>}
                </div>
                <div className="st-tags">{st.subjects.map(s => <span key={s.subj} className="st-tag">{s.subj} ({s.maxMarks})</span>)}</div>
                <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--sub)" }}>
                  <span>✓ Pass: <b style={{ color: "var(--green)" }}>{pass}</b></span>
                  <span>✗ Fail: <b style={{ color: "var(--red)" }}>{fail}</b></span>
                  <span>Absent: <b>{absent}</b></span>
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>Tap to see student marks →</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === "tests" && subView) {
    const st = subView;
    const stMarks = allMarks[st.id] || {};
    const stMax = st.subjects.reduce((a, s) => a + s.maxMarks, 0);
    return (
      <div>
        <button className="back" onClick={() => setSubView(null)}>← Back to Tests</button>
        <div style={{ padding: "0 14px 14px" }}>
          <div style={{ background: "var(--card)", borderRadius: "var(--r)", boxShadow: "var(--sh)", marginBottom: 12, padding: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{st.name}</div>
            <div className="st-tags" style={{ marginTop: 8 }}>{st.subjects.map(s => <span key={s.subj} className="st-tag">{s.subj}: {s.maxMarks}</span>)}</div>
          </div>
          <div className="card">
            {students.map(s => {
              const e = stMarks[s.id];
              const obtained = e && !e.absent ? st.subjects.reduce((a, sub) => { const v = e.scores?.[sub.subj]; return a + (v !== "" && v !== undefined ? Number(v) : 0); }, 0) : null;
              return (
                <div key={s.id} style={{ padding: "12px 15px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div><div style={{ fontWeight: 700, fontSize: 14 }}>{s.rollNo}. {s.name}</div><div style={{ fontSize: 11, color: "var(--sub)" }}>{s.gender}</div></div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {e?.absent && <span className="badge abs-badge">Absent</span>}
                      {!e?.absent && e?.pass === true && <span className="badge pass-badge">Pass</span>}
                      {!e?.absent && e?.pass === false && <span className="badge fail-badge">Fail</span>}
                      {obtained !== null && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 14, color: "var(--p)" }}>{obtained}/{stMax}</span>}
                      {!e && <span style={{ fontSize: 12, color: "#94a3b8" }}>Not entered</span>}
                    </div>
                  </div>
                  {e && !e.absent && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {st.subjects.map(sub => { const v = e.scores?.[sub.subj]; return (<span key={sub.subj} style={{ background: "var(--bg)", borderRadius: 8, padding: "3px 9px", fontSize: 11, fontWeight: 700 }}>{sub.subj}: <span style={{ color: "var(--p)", fontFamily: "'JetBrains Mono',monospace" }}>{v !== "" && v !== undefined ? v : "—"}/{sub.maxMarks}</span></span>); })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (view === "students" && !subView) {
    return (
      <div>
        <button className="back" onClick={() => setView(null)}>← Dashboard</button>
        <div style={{ padding: "0 14px 14px" }}>
          <div className="sec">Students ({totalStudents})</div>
          {students.length === 0 && <div className="empty"><div className="empty-icon">👥</div><div className="empty-txt">No students yet</div></div>}
          <div className="card">
            {students.map(s => {
              let tot = 0, mx = 0;
              slipTests.forEach(st => { const e = (allMarks[st.id] || {})[s.id]; if (!e || e.absent) return; const stMax = st.subjects.reduce((a, sub) => a + sub.maxMarks, 0); mx += stMax; st.subjects.forEach(sub => { const v = e.scores?.[sub.subj]; if (v !== "" && v !== undefined) tot += Number(v); }); });
              const avg = mx > 0 ? calcPct(tot, mx) : null;
              return (
                <div className="lrow clickable-row" key={s.id} onClick={() => setSubView(s)}>
                  <div className="lrow-info"><div className="lrow-name">{s.rollNo}. {s.name}</div><div className="lrow-sub">{s.gender}</div></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {avg !== null && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 16, color: "var(--p)" }}>{avg}%</span>}
                    <span style={{ color: "var(--sub)", fontSize: 16 }}>›</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (view === "students" && subView) {
    const s = subView;
    return (
      <div>
        <button className="back" onClick={() => setSubView(null)}>← Back to Students</button>
        <div style={{ padding: "0 14px 14px" }}>
          <div style={{ background: "var(--card)", borderRadius: "var(--r)", boxShadow: "var(--sh)", padding: 14, marginBottom: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 17 }}>{s.name}</div>
            <div style={{ fontSize: 12, color: "var(--sub)", marginTop: 2 }}>Roll: {s.rollNo} · {s.gender}</div>
          </div>
          <div className="sec">Slip Test Results</div>
          {slipTests.map(st => {
            const e = (allMarks[st.id] || {})[s.id];
            const stMax = st.subjects.reduce((a, sub) => a + sub.maxMarks, 0);
            const obtained = e && !e.absent ? st.subjects.reduce((a, sub) => { const v = e.scores?.[sub.subj]; return a + (v !== "" && v !== undefined ? Number(v) : 0); }, 0) : null;
            return (
              <div className="st-card" key={st.id} style={{ cursor: "default" }}>
                <div className="st-top">
                  <div><div className="st-name">{st.name}</div><div className="st-date">📅 {st.date}</div></div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {e?.absent && <span className="badge abs-badge">Absent</span>}
                    {!e?.absent && e?.pass === true && <span className="badge pass-badge">Pass</span>}
                    {!e?.absent && e?.pass === false && <span className="badge fail-badge">Fail</span>}
                    {obtained !== null && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 17, color: "var(--p)" }}>{obtained}/{stMax}</span>}
                    {!e && <span style={{ fontSize: 12, color: "#94a3b8" }}>Not entered</span>}
                  </div>
                </div>
                {e && !e.absent && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {st.subjects.map(sub => { const v = e.scores?.[sub.subj]; return (<span key={sub.subj} style={{ background: "var(--bg)", borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700 }}>{sub.subj}: <span style={{ color: "var(--p)", fontFamily: "'JetBrains Mono',monospace" }}>{v !== "" && v !== undefined ? v : "—"}/{sub.maxMarks}</span></span>); })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 14, paddingBottom: 84 }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: "var(--sub)", fontWeight: 700, marginBottom: 2 }}>Welcome,</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" }}>{school.hmName}</div>
        <div style={{ fontSize: 12, color: "var(--sub)" }}>{school.name}</div>
      </div>
      <div className="avg-tile">
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--sub)" }}>Overall Average</div>
          <div className="avg-num" style={{ color: overallAvg !== null ? "var(--p)" : "var(--sub)" }}>{overallAvg !== null ? overallAvg + "%" : "—"}</div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>across all tests & students</div>
        </div>
        <span style={{ fontSize: 36 }}>📊</span>
      </div>
      {overallAvg !== null && <div style={{ margin: "-4px 0 14px" }}><div className="pbar-wrap"><div className="pbar-fill" style={{ width: overallAvg + "%" }} /></div></div>}
      <div className="dash-grid">
        <div className="dash-tile" onClick={() => { setView("tests"); setSubView(null); }}>
          <div className="tile-icon">📋</div>
          <div className="tile-num">{totalTests}</div>
          <div className="tile-lbl">Slip Tests</div>
          <div className="tile-hint">Tap to view →</div>
        </div>
        <div className="dash-tile" onClick={() => { setView("students"); setSubView(null); }}>
          <div className="tile-icon">👥</div>
          <div className="tile-num amber">{totalStudents}</div>
          <div className="tile-lbl">Students</div>
          <div className="tile-hint">Tap to view →</div>
        </div>
      </div>
      {slipTests.length > 0 && (
        <>
          <div className="sec">Recent Tests</div>
          {slipTests.slice(-3).reverse().map(st => {
            const stMarks = allMarks[st.id] || {};
            const stMax = st.subjects.reduce((a, s) => a + s.maxMarks, 0);
            let tot = 0, mx = 0, pass = 0;
            students.forEach(s => { const e = stMarks[s.id]; if (!e || e.absent) return; if (e.pass === true) pass++; mx += stMax; st.subjects.forEach(sub => { const v = e.scores?.[sub.subj]; if (v !== "" && v !== undefined) tot += Number(v); }); });
            const avg = mx > 0 ? calcPct(tot, mx) : null;
            return (
              <div className="st-card clickable-row" key={st.id} onClick={() => { setView("tests"); setSubView(st); }}>
                <div className="st-top">
                  <div><div className="st-name">{st.name}</div><div className="st-date">📅 {st.date}</div></div>
                  {avg !== null ? <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 17, color: "var(--p)" }}>{avg}%</span> : <span style={{ fontSize: 12, color: "#94a3b8" }}>No marks</span>}
                </div>
                <div className="st-tags">{st.subjects.map(s => <span key={s.subj} className="st-tag">{s.subj}</span>)}</div>
                <div style={{ fontSize: 12, color: "var(--sub)" }}>Pass: {pass} · Tap to view marks →</div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

function HMApp({ session, onLogout }) {
  const school = session.school;
  const [tab, setTab] = useState("dash");
  const [students, setStudents] = useState([]);
  const [slipTests, setSlipTests] = useState([]);
  const [allMarks, setAllMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, showToast] = useToast();
  const [stuModal, setStuModal] = useState(null);
  const [stModal, setStModal] = useState(null);
  const [markView, setMarkView] = useState(null);
  const [delStu, setDelStu] = useState(null);
  const [delST, setDelST] = useState(null);

  useEffect(() => {
    const unsubStu = onSnapshot(studentsCol(school.id), snap => setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubST = onSnapshot(slipTestsCol(school.id), snap => setSlipTests(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubMarks = onSnapshot(marksCol(school.id), snap => {
      const m = {};
      snap.docs.forEach(d => { const [stId, stuId] = d.id.split("__"); if (!m[stId]) m[stId] = {}; m[stId][stuId] = d.data(); });
      setAllMarks(m); setLoading(false);
    });
    return () => { unsubStu(); unsubST(); unsubMarks(); };
  }, [school.id]);

  async function addStudent(data) { const id = uid(); await setDoc(doc(studentsCol(school.id), id), { ...data, createdAt: Date.now() }); setStuModal(null); showToast("✅ Student added!"); }
  async function editStudent(data) { await setDoc(doc(studentsCol(school.id), stuModal.id), { ...stuModal, ...data }); setStuModal(null); showToast("✅ Updated!"); }
  async function deleteStudent(id) { await deleteDoc(doc(studentsCol(school.id), id)); setDelStu(null); showToast("🗑 Student removed"); }
  async function addST(data) { const id = uid(); await setDoc(doc(slipTestsCol(school.id), id), { ...data, createdAt: Date.now() }); setStModal(null); showToast("✅ Slip test created!"); }
  async function editST(data) { await setDoc(doc(slipTestsCol(school.id), stModal.id), { ...stModal, ...data }); setStModal(null); showToast("✅ Updated!"); }
  async function deleteST(id) { await deleteDoc(doc(slipTestsCol(school.id), id)); setDelST(null); showToast("🗑 Deleted"); }
  async function handleMarkChange(stId, sid, entry) { await setDoc(doc(marksCol(school.id), markDocId(stId, sid)), entry); }

  if (loading) return <div className="loading"><div className="spinner" /><div>Loading…</div></div>;

  if (markView) {
    const st = slipTests.find(x => x.id === markView);
    if (!st) { setMarkView(null); return null; }
    return <MarkEntry school={school} slipTest={st} students={students} marks={allMarks[st.id] || {}} onMarkChange={(sid, entry) => handleMarkChange(st.id, sid, entry)} onBack={() => setMarkView(null)} toast={toast} showToast={showToast} />;
  }

  return (
    <div className="app">
      <div className="hdr">
        <div className="hdr-l"><span style={{ fontSize: 20 }}>🏫</span><div><div className="hdr-title">{school.name}</div><div className="hdr-sub">{school.hmName}</div></div></div>
        <button className="hbtn" onClick={onLogout}>Logout</button>
      </div>

      {tab === "dash" && <Dashboard school={school} students={students} slipTests={slipTests} allMarks={allMarks} />}

      {tab === "tests" && (
        <div className="page">
          <div className="sec">Slip Tests</div>
          {slipTests.length === 0 && <div className="empty"><div className="empty-icon">📋</div><div className="empty-txt">No slip tests yet</div><div className="empty-hint">Tap + to create one</div></div>}
          {slipTests.map(st => {
            const stMarks = allMarks[st.id] || {};
            const stMax = st.subjects.reduce((a, s) => a + s.maxMarks, 0);
            let tot = 0, mx = 0, pass = 0, fail = 0, absent = 0;
            students.forEach(s => { const e = stMarks[s.id]; if (!e) return; if (e.absent) { absent++; return; } if (e.pass === true) pass++; if (e.pass === false) fail++; mx += stMax; st.subjects.forEach(sub => { const v = e.scores?.[sub.subj]; if (v !== "" && v !== undefined) tot += Number(v); }); });
            const avg = mx > 0 ? calcPct(tot, mx) : null;
            return (
              <div className="st-card" key={st.id}>
                <div className="st-top">
                  <div><div className="st-name">{st.name}</div><div className="st-date">📅 {st.date}</div></div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="icon-btn" onClick={() => setStModal(st)}>✏️</button>
                    <button className="icon-btn" onClick={() => setDelST(st)}>🗑</button>
                  </div>
                </div>
                <div className="st-tags">{st.subjects.map(s => <span key={s.subj} className="st-tag">{s.subj} ({s.maxMarks})</span>)}</div>
                <div style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--sub)", marginBottom: 10 }}>
                  <span>✓ <b style={{ color: "var(--green)" }}>{pass}</b></span>
                  <span>✗ <b style={{ color: "var(--red)" }}>{fail}</b></span>
                  <span>Absent: <b>{absent}</b></span>
                  {avg !== null && <span>Avg: <b style={{ color: "var(--p)" }}>{avg}%</b></span>}
                </div>
                <button className="pbtn" style={{ padding: "11px", fontSize: 14 }} onClick={() => setMarkView(st.id)}>✏ Enter / Edit Marks</button>
              </div>
            );
          })}
        </div>
      )}

      {tab === "students" && (
        <div className="page">
          <div className="sec">Students — 10th Class</div>
          {students.length === 0 && <div className="empty"><div className="empty-icon">👥</div><div className="empty-txt">No students yet</div><div className="empty-hint">Tap + to add</div></div>}
          {students.length > 0 && (
            <div className="card">
              {[...students].sort((a,b) => a.rollNo.localeCompare(b.rollNo, undefined, {numeric:true})).map(s => (
                <div className="lrow" key={s.id}>
                  <div className="lrow-info"><div className="lrow-name">{s.rollNo}. {s.name}</div><div className="lrow-sub">{s.gender}</div></div>
                  <button className="icon-btn" onClick={() => setStuModal(s)}>✏️</button>
                  <button className="icon-btn" onClick={() => setDelStu(s)}>🗑</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab !== "dash" && <button className="fab" onClick={() => tab === "tests" ? setStModal("new") : setStuModal("new")}>＋</button>}

      <div className="bnav">
        {[{ key: "dash", icon: "🏠", lbl: "Dashboard" }, { key: "tests", icon: "📋", lbl: "Tests" }, { key: "students", icon: "👥", lbl: "Students" }].map(n => (
          <div className="bni" key={n.key} onClick={() => setTab(n.key)}>
            <span className="bni-icon">{n.icon}</span>
            <span className="bni-lbl" style={{ color: tab === n.key ? "var(--p)" : "var(--sub)" }}>{n.lbl}</span>
          </div>
        ))}
      </div>

      {stuModal && <StudentModal initial={stuModal === "new" ? null : stuModal} onSave={stuModal === "new" ? addStudent : editStudent} onClose={() => setStuModal(null)} />}
      {stModal && <SlipTestModal initial={stModal === "new" ? null : stModal} onSave={stModal === "new" ? addST : editST} onClose={() => setStModal(null)} />}
      {delStu && <Confirm title="Remove Student?" msg={"Remove " + delStu.name + "?"} onConfirm={() => deleteStudent(delStu.id)} onClose={() => setDelStu(null)} />}
      {delST && <Confirm title="Delete Slip Test?" msg={"Delete \"" + delST.name + "\" and all its marks?"} onConfirm={() => deleteST(delST.id)} onClose={() => setDelST(null)} />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  return (
    <>
      <style>{CSS}</style>
      {!session ? <Login onLogin={setSession} /> : <HMApp session={session} onLogout={() => setSession(null)} />}
    </>
  );
}
