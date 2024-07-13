// API 
const apiUrl = 'https://mp3quran.net/api/v3';
// القارئ
const reciters = 'reciters';
// language
const language = 'ar';


// fetch 
async function getReciters() {
    const chooseReciters = document.querySelector('#chooserReciters');

    const res = await fetch(`${apiUrl}/reciters?language=${language}`)
    const data = await res.json()

    chooseReciters.innerHTML = `<option value="">اختر القارئ</option>`;

    data.reciters.forEach(reciters => {
        chooseReciters.innerHTML += `<option value="${reciters.id}">${reciters.name}</option>`;
    });

    chooseReciters.addEventListener('change', (e) => {
        getMoshaf(e.target.value);
    })
}
getReciters();


// Request to API همرر له ال id ويطبع لي الرواية
async function getMoshaf(reciter) {
    const chooseMoshaf = document.querySelector('#chooseMoshaf');

    const res = await fetch(`${apiUrl}/reciters?language=${language}&reciter=${reciter}`);
    const data = await res.json();
    const moshafs = data.reciters[0].moshaf;

    chooseMoshaf.innerHTML = `<option value="" data-server="" data-surahList="">اختر المصحف</option>`;
    moshafs.forEach(moshaf => {
        chooseMoshaf.innerHTML += `<option 
            value="${moshaf.id}"
            data-server="${moshaf.server}"
            data-surahList="${moshaf.surah_list}"        
        >${moshaf.name}</option>`;
    });



    chooseMoshaf.addEventListener('change', (e) => {
        const selectedMoshaf = chooseMoshaf.options[chooseMoshaf.selectedIndex];
        const surahServer = selectedMoshaf.dataset.server;
        const surahList = selectedMoshaf.dataset.surahlist;
        getSurah(surahServer, surahList);
    })
}

// Fetch Surahs
async function getSurah(surahServer, surahList) {
    const chooseSurah = document.querySelector('#chooseSurah');

    const res = await fetch(`https://mp3quran.net/api/v3/suwar`);
    const data = await res.json();
    const surahNames = data.suwar;

    surahList = surahList.split(',');

    chooseSurah.innerHTML = `<option value="">اختر سورة</option>`;
    surahList.forEach(surah => {
        const padSurch = surah.padStart(3, '0')
        surahNames.forEach((surahName) => {
            if (surahName.id == surah) {
                chooseSurah.innerHTML += `<option value="${surahServer}${padSurch}.mp3">${surahName.name}</option>`;
            }
        });
    });

    // event مصحف
    chooseSurah.addEventListener('change', (e) => {
        const selectedSurah = chooseSurah.options[chooseSurah.selectedIndex];
        // console.log(selectedSurah.value);
        playSurah(selectedSurah.value)

    });

}

// Function Play Surah
function playSurah(surahMp3) {
    const audioPlayer = document.querySelector("#audioPlayer");
    audioPlayer.src = surahMp3;
    audioPlayer.play();
}

// Play live
function playLive(channel) {
    if(Hls.isSupported()) {
        var video = document.getElementById('liveVideo');
        var hls = new Hls();
        hls.loadSource(`${channel}`);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED,function() {
          video.play();
      });
     }
}



