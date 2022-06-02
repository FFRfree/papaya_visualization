var papaya = papaya || {};
papaya.data = papaya.data || {};
papaya.data.Atlas = papaya.data.Atlas || {};

let core_data = "core_data"


papaya.data.configureAtlas = async function (viewer) {
    if (this.atlas === null) {
        return;
    }
    let boundaryData = viewer.atlas.boundaryData;

    let boundaryVolumes = [];
    for (let key in papaya.data.Atlases) {
        try {
            if (papaya.data.Atlases.hasOwnProperty(key)) {
                let volume = papaya.data.Atlases[key].atlas.boundaryData.volume;
                if (volume && volume !== boundaryData.volume) {
                    boundaryVolumes.push(volume);
                }
            }
        } catch (err) {
            // Unable to get volume, cannot be open
        }
    }

    let loadVolume = (viewer.container.preferences.showVolumeBoundaries === "Yes");
    let ctr = 0;
    while (ctr < viewer.screenVolumes.length) {
        // Unload current boundary if desired
        if (viewer.screenVolumes[ctr].volume === boundaryData.volume) {
            if (!loadVolume) {
                viewer.closeOverlay(ctr);
                break;
            }
            loadVolume = false;
        }

        // Unloaded other boundary files
        for (let ctr2 = 0; ctr2 < boundaryVolumes.length; ctr2++) {
            if (viewer.screenVolumes[ctr].volume === boundaryVolumes[ctr2]) {
                viewer.closeOverlay(ctr);
                break;
            }
        }
        ctr++;
    }

    // Load the required image boundary
    if (loadVolume) {
        if (boundaryData.volume && viewer.loadingVolume === null) {
            viewer.loadingVolume = boundaryData.volume;
            viewer.initializeOverlay();
        } else {
            viewer.loadOverlay([viewer.container.findLoadableImage(boundaryData.boundaryimagefile, false).url],
                true, false, false);
            boundaryData.volume = viewer.loadingVolume;
        }
    }

    // Load surface boundary data if not loaded
    if (boundaryData && boundaryData.data == null) {
        let result = viewer.container.findLoadableImage(boundaryData.boundarysurfacefile, false);
        if (result.url) {
            let data = await loadatlas(result.url, boundaryData);
            let gii = gifti.parse(data);
            if (gii.getZScoresDataArray()) {
                boundaryData.data = gii.getZScoresDataArray().getData();
                boundaryData.range.min = Math.min(...boundaryData.data);
                boundaryData.range.max = Math.max(...boundaryData.data);
            }
        }
    }

    // Display the surface boundaries
    if (viewer.surfaces.length > 0) {
        let surface = viewer.surfaces[0];
        boundaryData = (boundaryData && viewer.container.preferences.showSurfaceBoundaries === "Yes") ? boundaryData : null;

        if (boundaryData !== surface.boundaryData) {
            surface.boundaryData = boundaryData;
            surface.generateColorData();
            viewer.drawViewer();
        }
    }
}

function loadatlas(url, boundaryData) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}


PAPAYA_BUILD_NUM = "1594";
("use strict");
papaya.data.Atlas.boundaryData = papaya.data.Atlas.boundaryData || {}
// var binaryMapper = binaryMapper || {}
var myLog = []
var binaryMapper = function binaryMapper(a, b) {
    myLog.push(a,b)
    return .5 < a ? {
        r: 0,
        g: 0,
        b: 0,
        a: b.range.alpha
    } : {
        r: 1,
        g: 1,
        b: 1,
        a: 1
    }
}

papaya.data.Atlases = papaya.data.Atlases || {};
papaya.data.Atlases["vPaxinos"] = {
    labels: {
        atlas: {
            data: {
                label: [
                    { index: 0, content: ": :background:" },
                    { index: 1, content: ": :A1/A2 : areas 1 and 2 of cortex" },
                    { index: 2, content: ": :A10 : area 10 of cortex" },
                    { index: 3, content: ": :A11 : area 11 of cortex" },
                    { index: 4, content: ": :A13L : area 13 of cortex lateral part" },
                    { index: 5, content: ": :A13M : area 13 of cortex medial part" },
                    { index: 6, content: ": :A13a : area 13a of cortex" },
                    { index: 7, content: ": :A13b : area 13b of cortex" },
                    { index: 8, content: ": :A14C : area 14 of cortex caudal part" },
                    { index: 9, content: ": :A14R : area 14 of cortex rostral part" },
                    {
                        index: 10,
                        content: ": :A19DI : area 19 of cortex dorsointermediate part",
                    },
                    { index: 11, content: ": :A19M : area 19 of cortex medial part" },
                    { index: 12, content: ": :A23V : area 23 of cortex ventral part" },
                    { index: 13, content: ": :A23a : area 23a of cortex" },
                    { index: 14, content: ": :A23b : area 23b of cortex" },
                    { index: 15, content: ": :A23c : area 23c of cortex" },
                    { index: 16, content: ": :A24a : area 24a of cortex" },
                    { index: 17, content: ": :A24b : area 24b of cortex" },
                    { index: 18, content: ": :A24c : area 24c of cortex" },
                    { index: 19, content: ": :A24d : area 24d of cortex" },
                    { index: 20, content: ": :A25 : area 25 of cortex" },
                    { index: 21, content: ": :A29a-c : area 29a-c of cortex" },
                    { index: 22, content: ": :A29d : area 29d of cortex" },
                    { index: 23, content: ": :A30 : area 30 of cortex" },
                    { index: 24, content: ": :A31 : area 31 of cortex" },
                    { index: 25, content: ": :A32 : area 32 of cortex" },
                    { index: 26, content: ": :A32V : area 32 of cortex ventral part" },
                    { index: 27, content: ": :A35 : area 35 of cortex" },
                    { index: 28, content: ": :A36 : area 36 of cortex" },
                    { index: 29, content: ": :A3a : area 3a of cortex (somatosensory)" },
                    { index: 30, content: ": :A3b : area 3b of cortex (somatosensory)" },
                    { index: 31, content: ": :A45 : area 45 of cortex" },
                    { index: 32, content: ": :A46D : area 46 of cortex dorsal part" },
                    { index: 33, content: ": :A46V : area 46 of cortex ventral part" },
                    {
                        index: 34,
                        content: ": :A47L : area 47 (old 12) of cortex lateral part",
                    },
                    {
                        index: 35,
                        content: ": :A47M : area 47 (old 12) of cortex medial part",
                    },
                    {
                        index: 36,
                        content: ": :A47O : area 47 (old 12) of cortex orbital part",
                    },
                    {
                        index: 37,
                        content: ": :A4ab : area 4 of cortex parts a and b (primary motor)",
                    },
                    {
                        index: 38,
                        content: ": :A4c : area 4 of cortex part c (primary motor)",
                    },
                    { index: 39, content: ": :A6DC : area 6 of cortex dorsocaudal part" },
                    { index: 40, content: ": :A6DR : area 6 of cortex dorsorostral part" },
                    {
                        index: 41,
                        content:
                            ": :A6M : area 6 of cortex medial (supplementary motor) part",
                    },
                    { index: 42, content: ": :A6Va : area 6 of cortex ventral part a" },
                    { index: 43, content: ": :A6Vb : area 6 of cortex ventral part b" },
                    { index: 44, content: ": :A8C : area 8 of cortex caudal part" },
                    { index: 45, content: ": :A8aD : area 8a of cortex dorsal part" },
                    { index: 46, content: ": :A8Av : area 8a of cortex ventral par" },
                    { index: 47, content: ": :A8b : area 8b of cortex" },
                    { index: 48, content: ": :A9 : area 9 of cortex" },
                    { index: 49, content: ": :n.a. : dummy ROI" },
                    { index: 50, content: ": :AI : agranular insular cortex" },
                    {
                        index: 51,
                        content: ": :AIP : anterior intraparietal area of cortex",
                    },
                    { index: 52, content: ": :Apri : amygdalopiriform transition area" },
                    { index: 53, content: ": :n.a. : dummy ROI" },
                    { index: 54, content: ": :AuA1 : auditory cortex primary area" },
                    { index: 55, content: ": :AuAL : auditory cortex anterolateral area" },
                    { index: 56, content: ": :AuCL : auditory cortex caudolateral area" },
                    { index: 57, content: ": :AuCM : auditory cortex caudomedial area" },
                    {
                        index: 58,
                        content: ": :AuCPB : auditory cortex caudal parabelt area",
                    },
                    { index: 59, content: ": :AuML : auditory cortex middle lateral area" },
                    { index: 60, content: ": :AuR : auditory cortex rostral area" },
                    { index: 61, content: ": :AuRM : auditory cortex rostromedial area" },
                    { index: 62, content: ": :AuRPB : auditory cortex rostral parabelt" },
                    { index: 63, content: ": :AuRT : auditory cortex rostrotemporal" },
                    {
                        index: 64,
                        content: ": :AuRTL : auditory cortex rostrotemporal lateral area",
                    },
                    {
                        index: 65,
                        content: ": :AuRTM : auditory cortex rostrotemporal medial area",
                    },
                    { index: 66, content: ": :n.a. : dummy ROI" },
                    { index: 67, content: ": :DI : dysgranular insular cortex" },
                    { index: 68, content: ": :n.a. : dummy ROI" },
                    { index: 69, content: ": :n.a. : dummy ROI" },
                    { index: 70, content: ": :Ent : entorhinal cortex" },
                    {
                        index: 71,
                        content: ": :FST : fundus of superior temporal sulcus area of cortex",
                    },
                    { index: 72, content: ": :GI : granular insular cortex" },
                    { index: 73, content: ": :Gu : gustatory cortex" },
                    { index: 74, content: ": :n.a. : dummy ROI" },
                    { index: 75, content: ": :Ipro : insular proisocortex" },
                    { index: 76, content: ": :LIP : lateral intraparietal area of cortex" },
                    { index: 77, content: ": :n.a. : dummy ROI" },
                    { index: 78, content: ": :n.a. : dummy ROI" },
                    { index: 79, content: ": :MIP : medial intraparietal area of cortex" },
                    { index: 80, content: ": :n.a. : dummy ROI" },
                    {
                        index: 81,
                        content: ": :MST : medial superior temporal area of cortex",
                    },
                    { index: 82, content: ": :n.a. : dummy ROI" },
                    { index: 83, content: ": :OPAl : orbital periallocortex" },
                    { index: 84, content: ": :OPro : orbital proisocortex" },
                    {
                        index: 85,
                        content: ": :OPt : occipito-parietal transitional area of cortex",
                    },
                    { index: 86, content: ": :n.a. : dummy ROI" },
                    { index: 87, content: ": :PE : parietal area PE" },
                    { index: 88, content: ": :PEC : parietal area PE caudal part" },
                    { index: 89, content: ": :PF : parietal area PF (cortex)" },
                    { index: 90, content: ": :PFG : parietal area PFG (cortex)" },
                    { index: 91, content: ": :PG : parietal area PG" },
                    {
                        index: 92,
                        content: ": :PGM : parietal area PG medial part (cortex)",
                    },
                    {
                        index: 93,
                        content:
                            ": :IPa : parietal areas PGa and IPa (fundus of superior temporal ventral area) PGa -",
                    },
                    { index: 94, content: ": :n.a. : dummy ROI" },
                    { index: 95, content: ": :n.a. : dummy ROI" },
                    { index: 96, content: ": :PaIL : parainsular cortex lateral part" },
                    { index: 97, content: ": :PaIM : parainsular cortex medial part" },
                    { index: 98, content: ": :n.a. : dummy ROI" },
                    { index: 99, content: ": :n.a. : dummy ROI" },
                    { index: 100, content: ": :Pir : piriform cortex" },
                    { index: 101, content: ": :n.a. : dummy ROI" },
                    { index: 102, content: ": :n.a. : dummy ROI" },
                    {
                        index: 103,
                        content:
                            ": :ProM : proisocortical motor region (precentral opercular cortex)",
                    },
                    { index: 104, content: ": :ProSt : prostriate area" },
                    { index: 105, content: ": :ReI : retroinsular area (cortex)" },
                    {
                        index: 106,
                        content: ": :S2E : secondary somatosensory cortex external part",
                    },
                    {
                        index: 107,
                        content: ": :S2I : secondary somatosensory cortex internal part",
                    },
                    {
                        index: 108,
                        content:
                            ": :S2PR : secondary somatosensory cortex parietal rostral area",
                    },
                    {
                        index: 109,
                        content:
                            ": :S2PV : secondary somatosensory cortex parietal ventral area",
                    },
                    { index: 110, content: ": :n.a. : dummy ROI" },
                    {
                        index: 111,
                        content: ": :STR : superior temporal rostral area (cortex)",
                    },
                    {
                        index: 112,
                        content: ": :TE1 : temporal area TE1 (inferior temporal cortex)",
                    },
                    {
                        index: 113,
                        content: ": :TE2 : temporal area TE2 (inferior temporal cortex)",
                    },
                    {
                        index: 114,
                        content: ": :TE3 : temporal area TE3 (inferior temporal cortex)",
                    },
                    { index: 115, content: ": :TEO : temporal area TE occipital part" },
                    { index: 116, content: ": :TF : temporal area TF" },
                    { index: 117, content: ": :TFO : temporal area TF occipital part" },
                    { index: 118, content: ": :TH : temporal area TH" },
                    { index: 119, content: ": :TL : temporal area TL" },
                    { index: 120, content: ": :TLO : temporal area TL occipital part" },
                    {
                        index: 121,
                        content:
                            ": :TPO : temporo-parieto-occipital association area (superior temporal polysensory cortex)",
                    },
                    { index: 122, content: ": :TPPro : temporopolar proisocortex" },
                    { index: 123, content: ": :Tpro : temporal proisocortex" },
                    { index: 124, content: ": :TPt : temporoparietal transitional area" },
                    { index: 125, content: ": :n.a. : dummy ROI" },
                    { index: 126, content: ": :V1 : primary visual cortex" },
                    { index: 127, content: ": :V2 : visual area 2" },
                    {
                        index: 128,
                        content: ": :V3 : visual area 3 (ventrolateral posterior area)",
                    },
                    { index: 129, content: ": :V3A : visual area 3A (dorsoanterior area)" },
                    {
                        index: 130,
                        content: ": :V4 : visual area 4 (ventrolatereral anterior area)",
                    },
                    {
                        index: 131,
                        content:
                            ": :V4T : visual area 4 transitional part (middle temporal crescent)",
                    },
                    { index: 132, content: ": :V5 : visual area 5 (middle temporal area)" },
                    { index: 133, content: ": :V6 : visual area 6 (dorsomedial area)" },
                    {
                        index: 134,
                        content: ": :V6A : visual area 6A (posterior parietal medial area)",
                    },
                    {
                        index: 135,
                        content: ": :VIP : ventral intraparietal area of cortex",
                    },
                    { index: 136, content: ": :n.a. : dummy ROI" },
                    { index: 137, content: ": :n.a. : dummy ROI" },
                    { index: 138, content: ": :n.a. : dummy ROI" },
                    { index: 139, content: ": :n.a. : dummy ROI" },
                    { index: 151, content: "HipF" },
                    { index: 152, content: "Amy" },
                    { index: 153, content: "Thal" },
                    { index: 154, content: "ZI" },
                    { index: 155, content: "Sth" },
                    { index: 156, content: "MGN" },
                    { index: 157, content: "LGN" },
                    { index: 158, content: "Cd" },
                    { index: 159, content: "Pu" },
                    { index: 160, content: "Acb" },
                    { index: 161, content: "Cl" },
                    { index: 162, content: "Hypo" },
                    { index: 163, content: "Sep" },
                    { index: 164, content: "GP" },
                    { index: 165, content: "IC" },
                    { index: 166, content: "SC" },
                    { index: 167, content: "SNR" },
                    { index: 168, content: "PAG" },
                    { index: 169, content: "HB" },
                    { index: 170, content: "CeB" },
                    { index: 151, content: ": :HipF : Hippocampalformation" },
                    { index: 152, content: ": :Amy : Amygdala" },
                    { index: 153, content: ": :Thal : Thalamus" },
                    { index: 154, content: ": :ZI : Zonaincerta" },
                    { index: 155, content: ": :Sth : Subthalamus" },
                    { index: 156, content: ": :MGN : Medialgeniculatenucleus" },
                    { index: 157, content: ": :LGN : Lateralgeniculatenucleus" },
                    { index: 158, content: ": :Cd : Caudate" },
                    { index: 159, content: ": :Pu : Putamen" },
                    { index: 160, content: ": :Acb : Acumbens" },
                    { index: 161, content: ": :Cl : Claustrumandendopirformclaustrum" },
                    { index: 162, content: ": :Hypo : Hypothalamus" },
                    { index: 163, content: ": :Sep : Septum" },
                    { index: 164, content: ": :GP : Globuspallidus" },
                    { index: 165, content: ": :IC : Inferiorcolliculus" },
                    { index: 166, content: ": :SC : Superiorcolliculus" },
                    { index: 167, content: ": :SNR : Substantianigra" },
                    { index: 168, content: ": :PAG : Periaqueductalgray" },
                    { index: 169, content: ": :HB : habenularnuclei" },
                    { index: 170, content: ": :CeB : Cerebellum" },
                ],
            },
            header: {
                images: {
                    summaryimagefile: "atlas_MBM_cortex_vPaxinos_both_same"
                },
                name: "Atlas V3 cortex Paxinos",
                type: "Label",
                // images: {
                //     summaryimagefile: "atlas_MBM_cortex_vPaxinos_and_subcortical",
                // },
                // display: "*.*",
                // name: "Paxinos Atlas",
                // type: "Label"
            },
            version: 2,
        },
    },
    boundaryData: {
        mapper: binaryMapper,
        range: {
            min: 0,
            max: 0,
            alpha: 0.3
        },
        boundaryimagefile: 'Paxinos Boundaries',
        boundarysurfacefile: 'Paxinos Surface Boundaries',
        data: null,
    }
};

papaya.data.Atlases["v4"] = {
    labels: {
        atlas: {
            data: {
                label: [
                { index: 0, content: ": :background :" }, { index: 1, content: ": :1-ACC : anterior cingulate cortex" }, { index: 2, content: ": :2-MedV1 : medial primary visual and MT/MST" }, { index: 3, content: ": :3-HighVisC : high-level 3" }, { index: 4, content: ": :4-ACC : anterior cingulate cortex" }, { index: 5, content: ": :5-MedV1 : medial primary visual and MT/MST" }, { index: 6, content: ": :6-LatV1 : lateral primary visual and MT/MST" }, { index: 7, content: ": :7-MedV1 : medial primary visual and MT/MST" },
                { index: 8, content: ": :8-MedV1 : medial primary visual and MT/MST" }, { index: 9, content: ": :9-HighVisA : high-level 1" }, { index: 10, content: ": :10-DorSoma : dorsal somatomotor" }, { index: 11, content: ": :11-OFC : orbital frontal" }, { index: 12, content: ": :12-ACC : anterior cingulate cortex" }, { index: 13, content: ": :13-HighVisB : high-level 2" }, { index: 14, content: ": :14-MedV1 : medial primary visual and MT/MST" }, { index: 15, content: ": :15-LatV1 : lateral primary visual and MT/MST" }, { index: 16, content: ": :16-MedV1 : medial primary visual and MT/MST" },
                { index: 17, content: ": :17-MedV1 : medial primary visual and MT/MST" }, { index: 18, content: ": :18-FPN : frontoparietal-like network" }, { index: 19, content: ": :19-AudIns : auditory and insular cortex" }, { index: 20, content: ": :20-LatV1 : lateral primary visual and MT/MST" }, { index: 21, content: ": :21-FPN : frontoparietal-like network" }, { index: 22, content: ": :22-ParapHipp : the parahippocampus/temporal pole" }, { index: 23, content: ": :23-ParapHipp : the parahippocampus/temporal pole" }, { index: 24, content: ": :24-ParapHipp : the parahippocampus/temporal pole" },
                { index: 25, content: ": :25-HighVisB : high-level 2" }, { index: 26, content: ": :26-HighVisC : high-level 3" }, { index: 27, content: ": :27-ForPole : frontal pole" }, { index: 28, content: ": :28-DorSoma : dorsal somatomotor" }, { index: 29, content: ": :29-DorSoma : dorsal somatomotor" }, { index: 30, content: ": :30-FPN : frontoparietal-like network" }, { index: 31, content: ": :31-ForPole : frontal pole" }, { index: 32, content: ": :32-OFC : orbital frontal" }, { index: 33, content: ": :33-AudIns : auditory and insular cortex" }, { index: 34, content: ": :34-Premotor : premotor" },
                { index: 35, content: ": :35-FPN : frontoparietal-like network" }, { index: 36, content: ": :36-ParapHipp : the parahippocampus/temporal pole" }, { index: 37, content: ": :37-VenSoma : ventral somatomotor" }, { index: 38, content: ": :38-ForPole : frontal pole" }, { index: 39, content: ": :39-DorSoma : dorsal somatomotor" }, { index: 40, content: ": :40-DMN : default-mode-like network" }, { index: 41, content: ": :41-ParapHipp : the parahippocampus/temporal pole" }, { index: 42, content: ": :42-FPN : frontoparietal-like network" }, { index: 43, content: ": :43-MedV1 : medial primary visual and MT/MST" },
                { index: 44, content: ": :44-OFC : orbital frontal" }, { index: 45, content: ": :45-Premotor : premotor" }, { index: 46, content: ": :46-AudIns : auditory and insular cortex" }, { index: 47, content: ": :47-ForPole : frontal pole" }, { index: 48, content: ": :48-HighVisA : high-level 1" }, { index: 49, content: ": :49-HighVisB : high-level 2" }, { index: 50, content: ": :50-HighVisC : high-level 3" }, { index: 51, content: ": :51-HighVisC : high-level 3" }, { index: 52, content: ": :52-ParapHipp : the parahippocampus/temporal pole" }, { index: 53, content: ": :53-ParapHipp : the parahippocampus/temporal pole" },
                { index: 54, content: ": :54-ParapHipp : the parahippocampus/temporal pole" }, { index: 55, content: ": :55-HighVisB : high-level 2" }, { index: 56, content: ": :56-ParapHipp : the parahippocampus/temporal pole" }, { index: 57, content: ": :57-OFC : orbital frontal" }, { index: 58, content: ": :58-FPN : frontoparietal-like network" }, { index: 59, content: ": :59-AudIns : auditory and insular cortex" }, { index: 60, content: ": :60-OFC : orbital frontal" }, { index: 61, content: ": :61-VenSoma : ventral somatomotor" }, { index: 62, content: ": :62-DMN : default-mode-like network" },
                { index: 63, content: ": :63-AudIns : auditory and insular cortex" }, { index: 64, content: ": :64-VenSoma : ventral somatomotor" }, { index: 65, content: ": :65-MedV1 : medial primary visual and MT/MST" }, { index: 66, content: ": :66-Premotor : premotor" }, { index: 67, content: ": :67-FPN : frontoparietal-like network" }, { index: 68, content: ": :68-ParapHipp : the parahippocampus/temporal pole" }, { index: 69, content: ": :69-DMN : default-mode-like network" }, { index: 70, content: ": :70-LatV1 : lateral primary visual and MT/MST" }, {
                    index: 71,
                    content: ": :71-ACC : anterior cingulate cortex"
                }, { index: 72, content: ": :72-Premotor : premotor" }, { index: 73, content: ": :73-FPN : frontoparietal-like network" }, { index: 74, content: ": :74-DMN : default-mode-like network" }, { index: 75, content: ": :75-DMN : default-mode-like network" }, { index: 76, content: ": :76-ACC : anterior cingulate cortex" }, { index: 77, content: ": :77-MedV1 : medial primary visual and MT/MST" }, { index: 78, content: ": :78-ParapHipp : the parahippocampus/temporal pole" }, { index: 79, content: ": :79-AudIns : auditory and insular cortex" },
                { index: 80, content: ": :80-MedV1 : medial primary visual and MT/MST" }, { index: 81, content: ": :81-HighVisC : high-level 3" }, { index: 82, content: ": :82-HighVisB : high-level 2" }, { index: 83, content: ": :83-AudIns : auditory and insular cortex" }, { index: 84, content: ": :84-MedV1 : medial primary visual and MT/MST" }, { index: 85, content: ": :85-HighVisB : high-level 2" }, { index: 86, content: ": :86-HighVisA : high-level 1" }, { index: 87, content: ": :87-DMN : default-mode-like network" }, { index: 88, content: ": :88-ACC : anterior cingulate cortex" },
                { index: 89, content: ": :89-DMN : default-mode-like network" }, { index: 90, content: ": :90-HighVisA : high-level 1" }, { index: 91, content: ": :91-OFC : orbital frontal" }, { index: 92, content: ": :92-DorSoma : dorsal somatomotor" }, { index: 93, content: ": :93-OFC : orbital frontal" }, { index: 94, content: ": :94-OFC : orbital frontal" }, { index: 95, content: ": :95-HighVisC : high-level 3" }, { index: 96, content: ": :96-HighVisA : high-level 1" }, { index: 151, content: ": :HipF : Hippocampalformation" }, { index: 152, content: ": :Amy : Amygdala" },
                { index: 153, content: ": :Thal : Thalamus" }, { index: 154, content: ": :ZI : Zonaincerta" }, { index: 155, content: ": :Sth : Subthalamus" }, { index: 156, content: ": :MGN : Medialgeniculatenucleus" }, { index: 157, content: ": :LGN : Lateralgeniculatenucleus" }, { index: 158, content: ": :Cd : Caudate" }, { index: 159, content: ": :Pu : Putamen" }, { index: 160, content: ": :Acb : Acumbens" }, { index: 161, content: ": :Cl : Claustrumandendopirformclaustrum" }, { index: 162, content: ": :Hypo : Hypothalamus" }, { index: 163, content: ": :Sep : Septum" }, {
                    index: 164,
                    content: ": :GP : Globuspallidus"
                    }, { index: 165, content: ": :IC : Inferiorcolliculus" }, { index: 166, content: ": :SC : Superiorcolliculus" }, { index: 167, content: ": :SNR : Substantianigra" }, { index: 168, content: ": :PAG : Periaqueductalgray" }, { index: 169, content: ": :HB : habenularnuclei" }, { index: 170, content: ": :CeB : Cerebellum" }
                ]
            },
            header: {
                images: { summaryimagefile: "v4_atlas" },
                name: "Atlas V4 cortex FC",
                type: "Label"
            },
            version: 2
        }
    },
    boundaryData: {
        mapper: binaryMapper,
        range: {
            min: 0,
            max: 96,
            alpha: 0.3
        },
        boundaryimagefile: 'Paxinos Boundaries',
        boundarysurfacefile: 'Paxinos Surface Boundaries',
        // boundarysurfacefile: 'v4 surface shape',
        // boundarysurfacefile: 'v4 surface shape',
        data: null,
    }
}

papaya.data.Atlases['vH'] = {
    labels: {
        atlas: {
            data: {
                label: [{ index: 0, content: ": :background :" }, { index: 1, content: ": :A10 : Area10" }, { index: 2, content: ": :A9 : Area9" }, { index: 3, content: ": :A46 : Area46" }, { index: 4, content: ": :8a : Area8a" }, { index: 5, content: ": :8b : Area8b" }, { index: 6, content: ": :A47L : Area47lateral" }, { index: 7, content: ": :A47M : Area47medial" }, { index: 8, content: ": :A45 : Area45" }, { index: 9, content: ": :ProM : Proisocorticalmotorregion(precentralopercularcortex)" }, { index: 10, content: ": :A32V : Area32ventral" },
                { index: 11, content: ": :A32D : Area32dorsal" }, { index: 12, content: ": :A14 : Area14" }, { index: 13, content: ": :A24a : Area24a" }, { index: 14, content: ": :A24b : Area24b" }, { index: 15, content: ": :A24cd : Area24cd" }, { index: 16, content: ": :A25 : Area25" }, { index: 17, content: ": :A11L : Area11lateral" }, { index: 18, content: ": :A11M : Area11medial" }, { index: 19, content: ": :A13L : Area13lateral" }, { index: 20, content: ": :A13M : Area13medial" }, { index: 21, content: ": :Gu : Gustatorycortex" }, { index: 22, content: ": :Opro : Orbitalproisocortex" },
                { index: 23, content: ": :OPAl : Orbitalpreiallocortex" }, { index: 24, content: ": :A6D : Area6dorsal" }, { index: 25, content: ": :A6M : Area6medial" }, { index: 26, content: ": :A6V : Areaventral" }, { index: 27, content: ": :A4M : Area4medal" }, { index: 28, content: ": :A4L : Area4lateral" }, { index: 29, content: ": :S1M : Primarysomatosensorymedial" }, { index: 30, content: ": :S1D : Primarysomatosensorydorsal" }, { index: 31, content: ": :S1V : Primarysomatosensoryventral" }, { index: 32, content: ": :S2a : Secondarysomatosensoryareaa" }, {
                    index: 33,
                    content: ": :S2b : Secondarysomatosensoryareab"
                }, { index: 34, content: ": :Core : Auditorycorearea" }, { index: 35, content: ": :BeltM : Auditorybeltareamedial" }, { index: 36, content: ": :BeltL : Auditorybeltarealateral" }, { index: 37, content: ": :PBR : Auditoryparabeltarearostral" }, { index: 38, content: ": :PBC : Auditoryparabeltareacaudal" }, { index: 39, content: ": :STR : Superiortemporalrostralarea" }, { index: 40, content: ": :AI : Argranularinsularcortex" }, { index: 41, content: ": :DI : Dysgranularinsularcortex" }, { index: 42, content: ": :GI : Granularinsularcortex" },
                { index: 43, content: ": :ReI : Retroinsulararea" }, { index: 44, content: ": :PaIR : Parainsularcortexrostral" }, { index: 45, content: ": :PaIC : Parainsularcortexcaudal" }, { index: 46, content: ": :Tpt : Temporoparietaltransitionalarea" }, { index: 47, content: ": :TPOR : Temporo-parito-occipitalassociationarearostral" }, { index: 48, content: ": :TPOC : Temporo-parito-occipitalassociationareacaudal" }, { index: 49, content: ": :FSTR : Fundusofsuperiortemproalarearostral" }, { index: 50, content: ": :FSTC : Fundusofsuperiortemproalareacaudal" },
                { index: 51, content: ": :TEa : Interiortemporalareaa" }, { index: 52, content: ": :TEb : Interiortemporalareab" }, { index: 53, content: ": :TEc : Interiortemporalareac" }, { index: 54, content: ": :TEd : Interiortemporalaread" }, { index: 55, content: ": :TEe : Interiortemporalareae" }, { index: 56, content: ": :TEf : Interiortemporalareaf" }, { index: 57, content: ": :TPPro : Temporopolarproisocortex" }, { index: 58, content: ": :PrhR : Perihinalcortexrostral" }, { index: 59, content: ": :PrhC : Perihinalcortexcaudal" }, { index: 60, content: ": :Enta : Entorhinalcortexa" },
                { index: 61, content: ": :Entb : Entorhinalcortexb" }, { index: 62, content: ": :PHGa : Parahippocampalcomplexa" }, { index: 63, content: ": :PHGb : Parahippocampalcomplexb" }, { index: 64, content: ": :PHGc : Parahippocampalcomplexc" }, { index: 65, content: ": :Pri : Piriform" }, { index: 66, content: ": :SB : Subiculum" }, { index: 67, content: ": :PEa : ParietalareaPEa" }, { index: 68, content: ": :PEb : ParietalareaPEb" }, { index: 69, content: ": :PF/PFGa : ParietalareaPF/PFGa" }, { index: 70, content: ": :PF/PFGb : ParietalareaPF/PFGb" }, {
                    index: 71,
                    content: ": :PGa : ParietalareaPGa"
                }, { index: 72, content: ": :PGb : ParietalareaPGa" }, { index: 73, content: ": :Opta : Occipito-parietaltranslationalareaa" }, { index: 74, content: ": :Optb : Occipito-parietaltranslationalareab" }, { index: 75, content: ": :IPa : Intraparietalareaa" }, { index: 76, content: ": :IPb : Intraparietalareab" }, { index: 77, content: ": :IPc : Intraparietalareac" }, { index: 78, content: ": :IPd : Intraparietalaread" }, { index: 79, content: ": :A23a : Area23a" }, { index: 80, content: ": :A23b : Area23b" }, { index: 81, content: ": :A23V : Area23ventral" },
                { index: 82, content: ": :A29M : Area29medial" }, { index: 83, content: ": :A30 : Area30" }, { index: 84, content: ": :A29V : Area29ventral" }, { index: 85, content: ": :A31 : Area31" }, { index: 86, content: ": :PGMa : Parietalareamediala" }, { index: 87, content: ": :PGMb : Parietalareamedialb" }, { index: 88, content: ": :ProSt : Prostriatearea" }, { index: 89, content: ": :V1a : VisualareaV1a" }, { index: 90, content: ": :V1b : VisualareaV1b" }, { index: 91, content: ": :V2M : VisualareaV2medial" }, { index: 92, content: ": :V2L : VisualareaV2lateral" }, {
                    index: 93,
                    content: ": :V2V : VisualareaV2ventral"
                }, { index: 94, content: ": :V3D : VisualareaV3dorsal" }, { index: 95, content: ": :V3L : VisualareaV3lateral" }, { index: 96, content: ": :V3V : VisualareaV3ventral" }, { index: 97, content: ": :V4L : VisualareaV4lateral" }, { index: 98, content: ": :V4V : VisualareaV4ventral" }, { index: 99, content: ": :V5R : VisualareaV5rostral" }, { index: 100, content: ": :V5C : VisualareaV5caudal" }, { index: 101, content: ": :V6R : VisualareaV6rostral" }, { index: 102, content: ": :V6M : VisualareaV6medial" }, {
                    index: 103,
                    content: ": :V6D : VisualareaV6dorsal"
                }, { index: 104, content: ": :A19DI : Area19dorsointermediatepart" }, { index: 105, content: ": :A19M : A19medialpart" }, { index: 106, content: ": :MST : Medialsuperiortemporalarea" }, { index: 151, content: ": :HipF : Hippocampalformation" }, { index: 152, content: ": :Amy : Amygdala" }, { index: 153, content: ": :Thal : Thalamus" }, { index: 154, content: ": :ZI : Zonaincerta" }, { index: 155, content: ": :Sth : Subthalamus" }, { index: 156, content: ": :MGN : Medialgeniculatenucleus" }, { index: 157, content: ": :LGN : Lateralgeniculatenucleus" },
                { index: 158, content: ": :Cd : Caudate" }, { index: 159, content: ": :Pu : Putamen" }, { index: 160, content: ": :Acb : Acumbens" }, { index: 161, content: ": :Cl : Claustrumandendopirformclaustrum" }, { index: 162, content: ": :Hypo : Hypothalamus" }, { index: 163, content: ": :Sep : Septum" }, { index: 164, content: ": :GP : Globuspallidus" }, { index: 165, content: ": :IC : Inferiorcolliculus" }, { index: 166, content: ": :SC : Superiorcolliculus" }, { index: 167, content: ": :SNR : Substantianigra" }, { index: 168, content: ": :PAG : Periaqueductalgray" },
                { index: 169, content: ": :HB : habenularnuclei" }, { index: 170, content: ": :CeB : Cerebellum" }]
            },
            header: {
                images: { summaryimagefile: "vH_atlas" },
                name: "Atlas V3 cortex vH",
                type: "Label"
            }, version: 2
        }
    },
    boundaryData: {
        mapper: binaryMapper,
        range: {
            min: 0,
            max: 0,
            alpha: 0.3
        },
        boundaryimagefile: 'Paxinos Boundaries',
        boundarysurfacefile: 'Paxinos Surface Boundaries',
        // boundarysurfacefile: 'v4 surface shape',
        // boundarysurfacefile: 'v4 surface shape',
        data: null,
    }
}


papaya.data.Atlases['vNetwork'] = {
    labels: {
        atlas: {
            data: {
                label: [
                    { index: 1, content: "ventral somatomotor"},
                    { index: 2, content: "dorsal somatomotor"},
                    { index: 3, content: "frontal pole"},
                    { index: 4, content: "the parahippocampus/temporal pole"},
                    { index: 5, content: "orbital frontal"},
                    { index: 6, content: "auditory and insular cortex (salience-related)"},
                    { index: 7, content: "frontoparietal-like network"},
                    { index: 8, content: "default-mode-like network"},
                    { index: 9, content: "visual-related network: medial primary visual and MT/MST"},
                    { index: 10, content: "visual-related network: lateral primary visual and MT/MST"},
                    { index: 11, content: "visual-related network: high-level 1"},
                    { index: 12, content: "visual-related network: high-level 2"},
                    { index: 13, content: "visual-related network: high-level 3"},
                    { index: 14, content: "anterior cingulate cortex (salience-related)"},
                    { index: 15, content: "premotor"},
                ]
            },
            header: {
                images: { summaryimagefile: "v4_network" },
                name: "Atlas V4 networks parcellation",
                type: "Label"
            }, version: 2
        }
    },
    boundaryData: {
        mapper: binaryMapper,
        range: {
            min: 0,
            max: 0,
            alpha: 0.3
        },
        boundaryimagefile: 'Paxinos Boundaries',
        boundarysurfacefile: 'Paxinos Surface Boundaries',
        data: null,
    }
}




var papayaLoadableImages = [
    { //0
        hide: true,
        // name: "atlas_MBM_cortex_vPaxinos_both_same",
        // nicename: "Atlas",
        // url: "data/atlas_MBM_cortex_vPaxinos_both_same.nii.gz",
    },
    { //1
        name: "atlas_MBM_cortex_vPaxinos_both_same",
        nicename: "atlas_MBM_cortex_vPaxinos_both_same",
        url: "data/atlas_MBM_cortex_vPaxinos_right.nii.gz",
        hide: true
    },
    { //2
        name: "template_myelinmap_brain",
        nicename: "template_myelinmap",
        url: "data/template_myelinmap_brain.nii.gz",
        hide: false
    },
    {//3
        name: "template_T1w_brain",
        nicename: "template_T1w",
        url: "data/template_T1w_brain.nii.gz",
        hide: false
    },
    { //4
        name: "template_T2w_brain",
        nicename: "template_T2w",
        url: "data/template_T2w_brain.nii.gz",
        hide: false
    },
    { //5
        name: 'graymid',
        nicename: "Gray Mid Right",
        url: "data" + "/surfFS.rh.graymid.surf.gii",
        surface: true,
        hide: true
    },
    { //6
        name: "Paxinos Surface Boundaries",
        nicename: "Paxinos Surface Boundaries",
        url: "data" + '/atlas_MBM_cortex_vPaxinos_and_subcortical_borders.R.func.gii',
        surface: true,
        hide: true
    },
    { //7
        name: 'Paxinos Boundaries',
        nicename: "Paxinos Atlas Boundaries",
        url: "data" + '/atlas_MBM_cortex_vPaxinos_and_subcortical_borders.nii.gz',
        hide: true
    },
    { //8
        name: 'v4_atlas',
        nicename: "v4_atlas",
        url: "data" + '/atlas_MBMv4_cortex_parcellation_right.nii.gz',
        hide: true
    },
    { //9
        name: 'vH_atlas',
        nicename: "vH_atlas",
        url: "data" + '/atlas_MBM_cortex_vH_right.nii.gz',
        hide: true
    },
    { //10
        name: 'parcellation_primary',
        nicename: "parcellation_primary",
        url: "data" + '/atlas_MBMv4_networks_parcellation_primary.nii.gz',
        hide: false
    },
    { //11
        name: 'parcellation_secondary',
        nicename: "parcellation_secondary",
        url: "data" + '/atlas_MBMv4_networks_parcellation_secondary.nii.gz',
        hide: false
    },
    { //12
        name: 'v4 surface label',
        nicename: "v4 surface label",
        url: "data" + '/surfFS.rh.MBMv4_cortex_parcellation.label.gii',
        surface: true,
    },
    { //13
        name: 'v4 surface shape',
        nicename: "v4 surface shape",
        url: "data" + '/surfFS.rh.MBMv4_cortex_parcellation.R.func.gii',
        surface: true,
    },
    { //14 network
        name: 'v4_network',
        nicename: "v4 network",
        url: "data" + '/atlas_MBMv4_networks_parcellation.nii.gz',
    },
];


// 这边应该有一个判断 然后选择atlas的逻辑
let atlas = document.querySelector('.papaya').getAttribute('atlas')
papaya.data.Atlas = papaya.data.Atlases[atlas]

var params = [];
params["surfaces"] = ['data/surfFS.rh.graymid.surf.gii'];
switch (atlas) {
    case "vPaxinos":
        params["images"] = ['data/template_myelinmap_brain.nii.gz', papayaLoadableImages[1].url];
        params["atlas"] = papayaLoadableImages[1].url;
        break;
    case "v4":
        params["images"] = ['data/template_myelinmap_brain.nii.gz', papayaLoadableImages[8].url];
        params["atlas"] = papayaLoadableImages[8].url;
        break;
    case "vH":
        params["images"] = ['data/template_myelinmap_brain.nii.gz', papayaLoadableImages[9].url];
        params["atlas"] = papayaLoadableImages[9].url;
        break;
    case "vNetwork":
        params["images"] = ['data/template_myelinmap_brain.nii.gz', papayaLoadableImages[14].url];
        params["atlas"] = papayaLoadableImages[14].url;

    default:
        break;
}
params["luts"] = [
    {
        name: "Custom",
        data: [
            [0, 0, 0, 0],
            [0.006711409395973154, 70, 130, 180],
            [0.013422818791946308, 245, 245, 245],
            [0.020134228187919462, 205, 62, 78],
            [0.026845637583892617, 120, 18, 134],
            [0.03355704697986577, 196, 58, 250],
            [0.040268456375838924, 0, 148, 0],
            [0.046979865771812075, 220, 248, 164],
            [0.05369127516778523, 230, 148, 34],
            [0.06040268456375838, 0, 118, 14],
            [0.06711409395973153, 0, 118, 14],
            [0.07382550335570469, 122, 186, 220],
            [0.08053691275167785, 236, 13, 176],
            [0.087248322147651, 12, 48, 255],
            [0.09395973154362416, 204, 182, 142],
            [0.10067114093959732, 42, 204, 164],
            [0.10738255033557048, 119, 159, 176],
            [0.11409395973154364, 220, 216, 20],
            [0.1208053691275168, 103, 255, 255],
            [0.12751677852348994, 80, 196, 98],
            [0.1342281879194631, 60, 58, 210],
            [0.14093959731543623, 60, 58, 210],
            [0.14765100671140938, 60, 58, 210],
            [0.15436241610738252, 60, 58, 210],
            [0.16107382550335567, 60, 60, 60],
            [0.1677852348993288, 255, 165, 0],
            [0.17449664429530196, 255, 165, 0],
            [0.1812080536912751, 0, 255, 127],
            [0.18791946308724825, 165, 42, 42],
            [0.1946308724832214, 135, 206, 235],
            [0.20134228187919453, 160, 32, 240],
            [0.20805369127516768, 0, 200, 200],
            [0.21476510067114082, 100, 50, 100],
            [0.22147651006711397, 135, 50, 74],
            [0.2281879194630871, 122, 135, 50],
            [0.23489932885906026, 51, 50, 135],
            [0.2416107382550334, 74, 155, 60],
            [0.24832214765100655, 120, 62, 43],
            [0.2550335570469797, 74, 155, 60],
            [0.26174496644295286, 122, 135, 50],
            [0.268456375838926, 70, 130, 180],
            [0.27516778523489915, 245, 245, 245],
            [0.2818791946308723, 205, 62, 78],
            [0.28859060402684544, 120, 18, 134],
            [0.2953020134228186, 196, 58, 250],
            [0.30201342281879173, 0, 148, 0],
            [0.3087248322147649, 220, 248, 164],
            [0.315436241610738, 230, 148, 34],
            [0.32214765100671117, 0, 118, 14],
            [0.3288590604026843, 0, 118, 14],
            [0.33557046979865746, 122, 186, 220],
            [0.3422818791946306, 236, 13, 176],
            [0.34899328859060375, 13, 48, 255],
            [0.3557046979865769, 220, 216, 20],
            [0.36241610738255003, 103, 255, 255],
            [0.3691275167785232, 80, 196, 98],
            [0.3758389261744963, 60, 58, 210],
            [0.38255033557046947, 255, 165, 0],
            [0.3892617449664426, 255, 165, 0],
            [0.39597315436241576, 0, 255, 127],
            [0.4026845637583889, 165, 42, 42],
            [0.40939597315436205, 135, 206, 235],
            [0.4161073825503352, 160, 32, 240],
            [0.42281879194630834, 0, 200, 221],
            [0.4295302013422815, 100, 50, 100],
            [0.4362416107382546, 135, 50, 74],
            [0.44295302013422777, 122, 135, 50],
            [0.4496644295302009, 51, 50, 135],
            [0.45637583892617406, 74, 155, 60],
            [0.4630872483221472, 120, 62, 43],
            [0.46979865771812035, 74, 155, 60],
            [0.4765100671140935, 122, 135, 50],
            [0.48322147651006664, 120, 190, 150],
            [0.4899328859060398, 122, 135, 50],
            [0.49664429530201293, 122, 135, 50],
            [0.5033557046979861, 200, 70, 255],
            [0.5100671140939592, 255, 148, 10],
            [0.5167785234899324, 255, 148, 10],
            [0.5234899328859055, 164, 108, 226],
            [0.5302013422818787, 164, 108, 226],
            [0.5369127516778518, 164, 108, 226],
            [0.5436241610738249, 255, 218, 185],
            [0.5503355704697981, 255, 218, 185],
            [0.5570469798657712, 234, 169, 30],
            [0.5637583892617444, 250, 255, 50],
            [0.5704697986577175, 200, 120, 255],
            [0.5771812080536907, 200, 121, 255],
            [0.5838926174496638, 200, 122, 255],
            [0.590604026845637, 205, 10, 125],
            [0.5973154362416101, 205, 10, 125],
            [0.6040268456375832, 160, 32, 240],
            [0.6107382550335564, 124, 140, 178],
            [0.6174496644295295, 125, 140, 178],
            [0.6241610738255027, 126, 140, 178],
            [0.6308724832214758, 127, 140, 178],
            [0.637583892617449, 124, 141, 178],
            [0.6442953020134221, 124, 142, 178],
            [0.6510067114093953, 124, 143, 178],
            [0.6577181208053684, 124, 144, 178],
            [0.6644295302013415, 124, 140, 179],
            [0.6711409395973147, 124, 140, 178],
            [0.6778523489932878, 125, 140, 178],
            [0.684563758389261, 126, 140, 178],
            [0.6912751677852341, 127, 140, 178],
            [0.6979865771812073, 124, 141, 178],
            [0.7046979865771804, 124, 142, 178],
            [0.7114093959731536, 124, 143, 178],
            [0.7181208053691267, 124, 144, 178],
            [0.7248322147650998, 124, 140, 179],
            [0.731543624161073, 255, 20, 147],
            [0.7382550335570461, 205, 179, 139],
            [0.7449664429530193, 238, 238, 209],
            [0.7516778523489924, 200, 200, 200],
            [0.7583892617449656, 74, 255, 74],
            [0.7651006711409387, 238, 0, 0],
            [0.7718120805369119, 0, 0, 139],
            [0.778523489932885, 173, 255, 47],
            [0.7852348993288581, 133, 203, 229],
            [0.7919463087248313, 26, 237, 57],
            [0.7986577181208044, 34, 139, 34],
            [0.8053691275167776, 30, 144, 255],
            [0.8120805369127507, 147, 19, 173],
            [0.8187919463087239, 238, 59, 59],
            [0.825503355704697, 221, 39, 200],
            [0.8322147651006702, 238, 174, 238],
            [0.8389261744966433, 255, 0, 0],
            [0.8456375838926165, 72, 61, 139],
            [0.8523489932885896, 21, 39, 132],
            [0.8590604026845627, 21, 39, 132],
            [0.8657718120805359, 65, 135, 20],
            [0.872483221476509, 65, 135, 20],
            [0.8791946308724822, 134, 4, 160],
            [0.8859060402684553, 221, 226, 68],
            [0.8926174496644285, 255, 255, 254],
            [0.8993288590604016, 52, 209, 226],
            [0.9060402684563748, 239, 160, 223],
            [0.9127516778523479, 70, 130, 180],
            [0.919463087248321, 70, 130, 181],
            [0.9261744966442942, 139, 121, 94],
            [0.9328859060402673, 224, 224, 224],
            [0.9395973154362405, 255, 0, 0],
            [0.9463087248322136, 205, 205, 0],
            [0.9530201342281868, 238, 238, 209],
            [0.9597315436241599, 139, 121, 94],
            [0.966442953020133, 238, 59, 59],
            [0.9731543624161062, 238, 59, 59],
            [0.9798657718120793, 238, 59, 59],
            [0.9865771812080525, 62, 10, 205],
            [0.9932885906040256, 62, 10, 205],
        ],
    },
];
params["atlas_MBM_cortex_vPaxinos_right.nii.gz"] = {
    min: 0,
    max: 259,
    lut: "Custom",
};
params['atlas_MBMv4_cortex_parcellation_right.nii.gz'] = {
    min: 0,
    max: 259,
    lut: "Custom",
};
params['atlas_MBM_cortex_vH_right.nii.gz'] = {
    min: 0,
    max: 259,
    lut: "Custom",
};
params['atlas_MBMv4_networks_parcellation.nii.gz'] = {
    min: 0,
    max: 259,
    lut: "Custom",
};
params['template_myelinmap_brain.nii.gz'] = {
    min: 0,
    max: 3
}
