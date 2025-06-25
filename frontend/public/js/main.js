document.addEventListener("DOMContentLoaded", function () {
    redirectToHomeIfNoHash();
    navigateTo(getCurrentPageFromHash());

    window.addEventListener('popstate', function (event) {
        const page = getCurrentPageFromHash();
        navigateTo(page);
    });
});

function base64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
}

function base64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
}

function redirectToHomeIfNoHash() {
    if (!window.location.hash) {
        window.location.hash = 'home';
    }
}

function getCurrentPageFromHash() {
    const hash = window.location.hash.substring(1);
    if (hash === '' || hash === 'home' || hash === 'categories' || hash === 'podcastSearch' || hash === 'randomPodcast' || hash === 'favorites' || hash === 'login' || hash === 'register') {
        return hash;
    } else {
        return 'home';
    }
}

function navigateTo(page, podcastData) {
    const appDiv = document.getElementById('app');
    let content;

    switch (page) {
        case 'home':
            content = generateHomePageContent();
            setTimeout(loadSlider, 50);
            break;
        case 'account-administration':
            content = `
<style>
.account-administration-container {width:100%;display:flex;justify-content:left;margin-top:18px;margin-bottom:100px;}
.account-administration-content {width:100%;display:flex;justify-content:left;flex-direction:column;}
.account-administration-title {margin-bottom:30px;text-align:left;color: #fff;font-family: SF Pro Display BoldItalic;font-size:34px;line-height:1;}
.account-administration-my {border-radius:22px;width:100%;padding:25px;background:#0d1116;}
.account-administration-my-title {text-align:left;color:#fff;font-family:SF Pro Display Bold;font-size:22px;line-height: 1;padding-bottom:12px}
.account-administration-my-desc {text-align:left;color:rgb(255, 255, 255, 0.5);font-family:SF Pro Display Semibold;font-size:17px;line-height: 1;padding-bottom:30px}
.account-administration-container-distance {margin-bottom:20px;}
.account-administration-my-contains-background {border-radius:22px;width:100%;padding:25px;background:#111b24;padding:20px;margin-bottom:25px;}
.account-administration-profildata-main {display:flex;justify-content:left;flex-direction:column;}
.account-administration-profildata-title {text-align:left;color:#fff;font-family:SF Pro Display Bold;font-size:19px;line-height:1;padding-bottom:13px}
.account-administration-profildata-main-container {display:flex;justify-content:left;flex-direction:column;text-align:left}
.account-administration-profildata-main-text {font-size:16px;color:rgb(255, 255, 255, 0.7);}
.account-administration-mypassword-form {display:flex;justify-content:left;flex-direction:column;}
.account-administration-mypassword-notifications {text-align:center;color:#c50404d6;justify-content:left;width:320px;margin-bottom:10px;font-size:14px;display:flex;}
.account-administration-mypassword-title {text-align:left;color:#fff;font-family:SF Pro Display Bold;font-size:19px;line-height:1;padding-bottom:13px}
.account-administration-mypassword-input {margin-bottom:10px;display:flex;align-items:center;width:290px;height:42px;border-radius:12px;border:1px solid rgb(255, 255, 255, 0.1);font-family: "SF Pro Display Medium", sans-serif;color:rgb(255, 255, 255, 0.7);background:transparent;font-size:15px;padding:0 14px;}
.account-administration-mypassword-input:focus {outline:0;border:1px solid #79b4c9;}
.account-administration-mypassword-button-password-change {color:white;cursor:pointer;background-color:#79b4c9;border:none;border-radius:14px;padding:7px 20px;font-size:16px;transition:all .3s ease-in-out;margin-top:6px;}
.account-administration-deleteaccount-button {color:white;cursor:pointer;background-color:rgb(250, 35, 59);border:none;border-radius:14px;padding:7px 20px;font-size:16px;transition:all .3s ease-in-out;}
</style>
                <div class="account-administration-container">
                    <div class="account-administration-content"> 
                        <h1 class="account-administration-title">Account Verwaltung</h1>
                        <div class="account-administration-my">
                            <div class="account-administration-my-content">
                                <h1 class="account-administration-my-title">Über mich</h1>
                                <p class="account-administration-my-desc">Hier können sie ihren Account Verwalten. (z.B Lösch Funktion und viele weitere Funktionen stehen ihnen hier zur verfügung)</p>
                                <div class="account-administration-my-contains-background">
                                    <div class="account-administration-profildata-main">
                                        <h1 class="account-administration-profildata-title">Account Daten</h1>
                                        <div class="account-administration-profildata-main-container" id="account-administration-profildata-main-container"></div>
                                    </div>
                                </div>
                                <div class="account-administration-container-distance"></div>
                                <div class="account-administration-my-contains-background">
                                    <div class="account-administration-mypassword-form">
                                        <h1 class="account-administration-mypassword-title">Passwort ändern</h1>
                                        <p class="account-administration-mypassword-notifications"></p>
                                        <div class="account-administration-mypassword-inputs">
                                            <input class="account-administration-mypassword-input-altpassword account-administration-mypassword-input" type="password" placeholder="Altes Passwort eingeben" name="altpassword" required>
                                            <input class="account-administration-mypassword-input-newpassword account-administration-mypassword-input" type="password" placeholder="Neues Passwort eingeben" name="newpassword" required>
                                            <input class="account-administration-mypassword-input-newpasswordConfirm account-administration-mypassword-input" type="password" placeholder="Neues Passwort bestätigen" name="newpasswordConfirm" required>
                                            <button class="account-administration-mypassword-button-password-change">Passwort ändern</button>
                                        </div>
                                    </div>
                                </div>
                                <button class="account-administration-deleteaccount-button" onclick="deleteAccount()">Account löschen</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'login':
            content = `
                <div class="login-container">
                    <div class="login-content">
                        <div class="login-auth-container">
                            <form class="login-auth-form" method="POST">
                                <h1 class="login-auth-form-title">Account</h1>
                                <p class="login-auth-form-notification"></p>
                                <div class="login-auth-form-inputs">
                                    <div class="login-auth-form-input-email-container input-container">
                                        <input class="login-auth-form-input-email" type="text" placeholder="Email-Adresse" name="email">
                                    </div>
                                    <div class="login-distance"></div>
                                    <div class="login-auth-form-input-password-container input-container"> 
                                        <input class="login-auth-form-input-password" type="password" placeholder="Passwort" name="password">
                                    </div>
                                    <label class="login-auth-form-input-rememberMe-container">
                                        <input type="checkbox" class="login-auth-form-input-rememberMe" style="margin-right:10px;"> 
                                        Angemeldet bleiben (klick)
                                    </label>
                                </div>
                                <button class="login-auth-form-button-anmelden">Anmelden</button>
                                <button class="login-auth-form-register-link" href="#register" onclick="navigateTo('register')">Jetzt einen Account erstellen?</button>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'register':
            content = `
                <div class="register-container">
                    <div class="register-content">
                        <div class="register-auth-container">
                            <form class="register-auth-form" method="POST">
                                 <h1 class="register-auth-form-title">Account</h1>
                                 <div class="register-auth-form-inputs">
                                      <div class="register-auth-form-input-firstname-container input-container">
                                          <input class="register-auth-form-input-firstname" type="text" placeholder="Vorname" name="firstname">
                                     </div>
                                     <div class="register-distance"></div>
                                     <div class="register-auth-form-input-username-container input-container">
                                          <input class="register-auth-form-input-username" type="text" placeholder="Nutzername" name="username">
                                     </div>
                                     <div class="register-distance"></div>
                                     <div class="register-auth-form-input-email-container input-container">
                                          <input class="register-auth-form-input-email" type="text" placeholder="Email-Adresse" name="email">
                                     </div>
                                     <div class="register-distance"></div>
                                     <div class="register-auth-form-input-password-container input-container"> 
                                          <input class="register-auth-form-input-password" type="password" placeholder="Passwort" name="password">
                                     </div>
                                     <div class="register-distance"></div>
                                     <div class="register-auth-form-input-password-confirm-container input-container">
                                          <input class="register-auth-form-input-password-confirm" type="password" placeholder="Passwort bestätigen" name="passwordConfirm">
                                     </div>
                                 </div>
                                 <button class="register-auth-form-button-anmelden">Registrieren</button>
                                 <button class="register-auth-form-login-link" href="#login" onclick="navigateTo('login')">Du hast schon einen Account?</button>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'credits':
            content = `
                <div class="credits-main-container">
                    <div class="credits-main-content">
                        <h1 class="credits-title">Mitwirkende</h1>
                        <p class="credits-undertitle">Hier ist eine Liste mit alle Mitwirkenden des Podcast Projekt.</p>
                        <ul class="credits-list-container">
                            <li class="credits-list-listitem">
                                <h1 class="credits-list-listitem-text"><i class="credits-list-listitem-text-arrow fa-solid fa-arrow-right"></i> Guilherme Ferreira de Mattos Nogueira Junior</h1>
                            </li>
                            <li class="credits-list-listitem">
                                <h1 class="credits-list-listitem-text"><i class="credits-list-listitem-text-arrow fa-solid fa-arrow-right"></i> Niclas Tredup</h1>
                            </li>
                            <li class="credits-list-listitem">
                                <h1 class="credits-list-listitem-text"><i class="credits-list-listitem-text-arrow fa-solid fa-arrow-right"></i> Lucas Tuscher</h1>
                            </li>
                        </ul>
                    </div>
                </div>
            `;
            break;
        case 'randomPodcast':
            content = `
                <div class="random-podcast-main-container">
                    <div class="random-podcast-main-content">
                        <h1 class="random-podcast-title">Zufallspodcast</h1>
                        <p class="random-podcast-undertitle">Lass dir einen zufälligen Podcast anzeigen um neue Podcasts zu entdecken.</p>
                        <button class="random-podcast-button" id="randomPodcastBtn" onclick="getRandomPodcast()" title="Zufälliger Podcast Suchen">Zufälliger Podcast Suchen</button>
                        <div class="random-podcast-podcast-info-container" id="podcastInfo"></div>
                    </div>
                </div> 
            `;
            break;
        case 'category-film-history':
            const filmHistorySubcategoryId = 207;

            content = `
                <div class="main-body-container">
                    <div class="main-body-content">
                        <div class="main-body-title-container">
                            <div class="main-body-title-left-container">
                                <h1 class="main-body-title">Filmgeschichte Podcasts</h1>
                            </div>
                            <div class="main-body-title-right-container">
                                <div class="back-to-category-container">
                                    <button class="back-to-category-button" href="#categorie" onclick="navigateTo('categories')"><i class="fa-solid fa-chevron-left" style="padding-right:5px;font-size:10px;"></i> Zurück zu Kategorien</button>
                                </div>
                            </div>   
                        </div>
                        <div class="main-body-line-container"></div>
                        <div class="main-body-main_page-container">
                            <div class="main-body-main_page-content">
                                <div class="loading" id="loading">
                                    <div class='session-renewed-container'>
                                        <div class='session-renewed-left-container'>
                                            <h1 class='session-renewed-left-text'>Podcasts laden...</h1>
                                        </div>
                                        <div class='session-renewed-right-container'>
                                            <div class="loading-animation-01-container">
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="category-page" id="category-page" style="display:none;">
                                    <div class="category-podcast-list"></div>
                                </div>
                                <div style="margin-bottom:125px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ` ;

            appDiv.innerHTML = content;

            fetchCategoryPodcasts(filmHistorySubcategoryId).then(podcasts => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('category-page').style.display = 'block';
                const filmHistoryContent = generateCategoryPageContent(podcasts);
                document.querySelector('.category-podcast-list').innerHTML = filmHistoryContent;
            });
            break;

        case 'category-wilderness':
            const wildernessSubcategoryId = 201;

            content = `
                <div class="main-body-container">
                    <div class="main-body-content">
                        <div class="main-body-title-container">
                            <div class="main-body-title-left-container">
                                <h1 class="main-body-title">Wildnis Podcasts</h1>
                            </div>
                            <div class="main-body-title-right-container">
                                <div class="back-to-category-container">
                                    <button class="back-to-category-button" href="#categorie" onclick="navigateTo('categories')"><i class="fa-solid fa-chevron-left" style="padding-right:5px;font-size:10px;"></i> Zurück zu Kategorien</button>
                                </div>
                            </div>   
                        </div>
                        <div class="main-body-line-container"></div>
                        <div class="main-body-main_page-container">
                            <div class="main-body-main_page-content">
                                <div class="loading" id="loading">
                                    <div class='session-renewed-container'>
                                        <div class='session-renewed-left-container'>
                                            <h1 class='session-renewed-left-text'>Podcasts laden...</h1>
                                        </div>
                                        <div class='session-renewed-right-container'>
                                            <div class="loading-animation-01-container">
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="category-page" id="category-page" style="display:none;">
                                    <div class="category-podcast-list"></div>
                                </div>
                                <div style="margin-bottom:125px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ` ;

            appDiv.innerHTML = content;

            fetchCategoryPodcasts(wildernessSubcategoryId).then(podcasts => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('category-page').style.display = 'block';
                const wildernessContent = generateCategoryPageContent(podcasts);
                document.querySelector('.category-podcast-list').innerHTML = wildernessContent;
            });
            break;

        case 'category-football':
            const footballSubcategoryId = 197;

            content = `
                <div class="main-body-container">
                    <div class="main-body-content">
                        <div class="main-body-title-container">
                            <div class="main-body-title-left-container">
                                <h1 class="main-body-title">Fussball Podcasts</h1>
                            </div>
                            <div class="main-body-title-right-container">
                                <div class="back-to-category-container">
                                    <button class="back-to-category-button" href="#categorie" onclick="navigateTo('categories')"><i class="fa-solid fa-chevron-left" style="padding-right:5px;font-size:10px;"></i> Zurück zu Kategorien</button>
                                </div>
                            </div>   
                        </div>
                        <div class="main-body-line-container"></div>
                        <div class="main-body-main_page-container">
                            <div class="main-body-main_page-content">
                                <div class="loading" id="loading">
                                    <div class='session-renewed-container'>
                                        <div class='session-renewed-left-container'>
                                            <h1 class='session-renewed-left-text'>Podcasts laden...</h1>
                                        </div>
                                        <div class='session-renewed-right-container'>
                                            <div class="loading-animation-01-container">
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="category-page" id="category-page" style="display:none;">
                                    <div class="category-podcast-list"></div>
                                </div>
                                <div style="margin-bottom:125px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ` ;

            appDiv.innerHTML = content;

            fetchCategoryPodcasts(footballSubcategoryId).then(podcasts => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('category-page').style.display = 'block';
                const footballContent = generateCategoryPageContent(podcasts);
                document.querySelector('.category-podcast-list').innerHTML = footballContent;
            });
            break;

        case 'category-religion':
            const religionSubcategoryId = 169;

            content = `
                <div class="main-body-container">
                    <div class="main-body-content">
                        <div class="main-body-title-container">
                            <div class="main-body-title-left-container">
                                <h1 class="main-body-title">Religion Podcasts</h1>
                            </div>
                            <div class="main-body-title-right-container">
                                <div class="back-to-category-container">
                                    <button class="back-to-category-button" href="#categorie" onclick="navigateTo('categories')"><i class="fa-solid fa-chevron-left" style="padding-right:5px;font-size:10px;"></i> Zurück zu Kategorien</button>
                                </div>
                            </div>   
                        </div>
                        <div class="main-body-line-container"></div>
                        <div class="main-body-main_page-container">
                            <div class="main-body-main_page-content">
                                <div class="loading" id="loading">
                                    <div class='session-renewed-container'>
                                        <div class='session-renewed-left-container'>
                                            <h1 class='session-renewed-left-text'>Podcasts laden...</h1>
                                        </div>
                                        <div class='session-renewed-right-container'>
                                            <div class="loading-animation-01-container">
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="category-page" id="category-page" style="display:none;">
                                    <div class="category-podcast-list"></div>
                                </div>
                                <div style="margin-bottom:125px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ` ;

            appDiv.innerHTML = content;

            fetchCategoryPodcasts(religionSubcategoryId).then(podcasts => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('category-page').style.display = 'block';
                const religionContent = generateCategoryPageContent(podcasts);
                document.querySelector('.category-podcast-list').innerHTML = religionContent;
            });
            break;

        case 'category-business-news':
            const businessNewsSubcategoryId = 156;

            content = `
                <div class="main-body-container">
                    <div class="main-body-content">
                        <div class="main-body-title-container">
                            <div class="main-body-title-left-container">
                                <h1 class="main-body-title">Geschäftsnachrichten Podcasts</h1>
                            </div>
                            <div class="main-body-title-right-container">
                                <div class="back-to-category-container">
                                    <button class="back-to-category-button" href="#categorie" onclick="navigateTo('categories')"><i class="fa-solid fa-chevron-left" style="padding-right:5px;font-size:10px;"></i> Zurück zu Kategorien</button>
                                </div>
                            </div>   
                        </div>
                        <div class="main-body-line-container"></div>
                        <div class="main-body-main_page-container">
                            <div class="main-body-main_page-content">
                                <div class="loading" id="loading">
                                    <div class='session-renewed-container'>
                                        <div class='session-renewed-left-container'>
                                            <h1 class='session-renewed-left-text'>Podcasts laden...</h1>
                                        </div>
                                        <div class='session-renewed-right-container'>
                                            <div class="loading-animation-01-container">
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="category-page" id="category-page" style="display:none;">
                                    <div class="category-podcast-list"></div>
                                </div>
                                <div style="margin-bottom:125px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ` ;

            appDiv.innerHTML = content;

            fetchCategoryPodcasts(businessNewsSubcategoryId).then(podcasts => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('category-page').style.display = 'block';
                const businessNewsContent = generateCategoryPageContent(podcasts);
                document.querySelector('.category-podcast-list').innerHTML = businessNewsContent;
            });
            break;

        case 'category-video-games':
            const videoGamesSubcategoryId = 140;

            content = `
                <div class="main-body-container">
                    <div class="main-body-content">
                        <div class="main-body-title-container">
                            <div class="main-body-title-left-container">
                                <h1 class="main-body-title">Videospiele Podcasts</h1>
                            </div>
                            <div class="main-body-title-right-container">
                                <div class="back-to-category-container">
                                    <button class="back-to-category-button" href="#categorie" onclick="navigateTo('categories')"><i class="fa-solid fa-chevron-left" style="padding-right:5px;font-size:10px;"></i> Zurück zu Kategorien</button>
                                </div>
                            </div>   
                        </div>
                        <div class="main-body-line-container"></div>
                        <div class="main-body-main_page-container">
                            <div class="main-body-main_page-content">
                                <div class="loading" id="loading">
                                    <div class='session-renewed-container'>
                                        <div class='session-renewed-left-container'>
                                            <h1 class='session-renewed-left-text'>Podcasts laden...</h1>
                                        </div>
                                        <div class='session-renewed-right-container'>
                                            <div class="loading-animation-01-container">
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="category-page" id="category-page" style="display:none;">
                                    <div class="category-podcast-list"></div>
                                </div>
                                <div style="margin-bottom:125px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ` ;

            appDiv.innerHTML = content;

            fetchCategoryPodcasts(videoGamesSubcategoryId).then(podcasts => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('category-page').style.display = 'block';
                const videoGamesContent = generateCategoryPageContent(podcasts);
                document.querySelector('.category-podcast-list').innerHTML = videoGamesContent;
            });
            break;


        case 'category-pets-animals':
            const petsAnimalsSubcategoryId = 140;

            content = `
                <div class="main-body-container">
                    <div class="main-body-content">
                        <div class="main-body-title-container">
                            <div class="main-body-title-left-container">
                                <h1 class="main-body-title">Haustiere Podcasts</h1>
                            </div>
                            <div class="main-body-title-right-container">
                                <div class="back-to-category-container">
                                    <button class="back-to-category-button" href="#categorie" onclick="navigateTo('categories')"><i class="fa-solid fa-chevron-left" style="padding-right:5px;font-size:10px;"></i> Zurück zu Kategorien</button>
                                </div>
                            </div>   
                        </div>
                        <div class="main-body-line-container"></div>
                        <div class="main-body-main_page-container">
                            <div class="main-body-main_page-content">
                                <div class="loading" id="loading">
                                    <div class='session-renewed-container'>
                                        <div class='session-renewed-left-container'>
                                            <h1 class='session-renewed-left-text'>Podcasts laden...</h1>
                                        </div>
                                        <div class='session-renewed-right-container'>
                                            <div class="loading-animation-01-container">
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="category-page" id="category-page" style="display:none;">
                                    <div class="category-podcast-list"></div>
                                </div>
                                <div style="margin-bottom:125px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ` ;

            appDiv.innerHTML = content;

            fetchCategoryPodcasts(petsAnimalsSubcategoryId).then(podcasts => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('category-page').style.display = 'block';
                const petsAnimalsContent = generateCategoryPageContent(podcasts);
                document.querySelector('.category-podcast-list').innerHTML = petsAnimalsContent;
            });
            break;

        case 'category-parenting':
            const parentingSubcategoryId = 139;

            content = `
                <div class="main-body-container">
                    <div class="main-body-content">
                        <div class="main-body-title-container">
                            <div class="main-body-title-left-container">
                                <h1 class="main-body-title">Erziehung Podcasts</h1>
                            </div>
                            <div class="main-body-title-right-container">
                                <div class="back-to-category-container">
                                    <button class="back-to-category-button" href="#categorie" onclick="navigateTo('categories')"><i class="fa-solid fa-chevron-left" style="padding-right:5px;font-size:10px;"></i> Zurück zu Kategorien</button>
                                </div>
                            </div>   
                        </div>
                        <div class="main-body-line-container"></div>
                        <div class="main-body-main_page-container">
                            <div class="main-body-main_page-content">
                                <div class="loading" id="loading">
                                    <div class='session-renewed-container'>
                                        <div class='session-renewed-left-container'>
                                            <h1 class='session-renewed-left-text'>Podcasts laden...</h1>
                                        </div>
                                        <div class='session-renewed-right-container'>
                                            <div class="loading-animation-01-container">
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="category-page" id="category-page" style="display:none;">
                                    <div class="category-podcast-list"></div>
                                </div>
                                <div style="margin-bottom:125px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ` ;

            appDiv.innerHTML = content;

            fetchCategoryPodcasts(parentingSubcategoryId).then(podcasts => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('category-page').style.display = 'block';
                const parentingContent = generateCategoryPageContent(podcasts);
                document.querySelector('.category-podcast-list').innerHTML = parentingContent;
            });
            break;

        case 'category-sexuality':
            const sexualitySubcategoryId = 136;

            content = `
                <div class="main-body-container">
                    <div class="main-body-content">
                        <div class="main-body-title-container">
                            <div class="main-body-title-left-container">
                                <h1 class="main-body-title">Sexualität Podcasts</h1>
                            </div>
                            <div class="main-body-title-right-container">
                                <div class="back-to-category-container">
                                    <button class="back-to-category-button" href="#categorie" onclick="navigateTo('categories')"><i class="fa-solid fa-chevron-left" style="padding-right:5px;font-size:10px;"></i> Zurück zu Kategorien</button>
                                </div>
                            </div>   
                        </div>
                        <div class="main-body-line-container"></div>
                        <div class="main-body-main_page-container">
                            <div class="main-body-main_page-content">
                                <div class="loading" id="loading">
                                    <div class='session-renewed-container'>
                                        <div class='session-renewed-left-container'>
                                            <h1 class='session-renewed-left-text'>Podcasts laden...</h1>
                                        </div>
                                        <div class='session-renewed-right-container'>
                                            <div class="loading-animation-01-container">
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="category-page" id="category-page" style="display:none;">
                                    <div class="category-podcast-list"></div>
                                </div>
                                <div style="margin-bottom:125px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ` ;

            appDiv.innerHTML = content;

            fetchCategoryPodcasts(sexualitySubcategoryId).then(podcasts => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('category-page').style.display = 'block';
                const fitnessContent = generateCategoryPageContent(podcasts);
                document.querySelector('.category-podcast-list').innerHTML = sexualityContent;
            });
            break;

        case 'category-fitness':
            const fitnessSubcategoryId = 132;

            content = `
                <div class="main-body-container">
                    <div class="main-body-content">
                        <div class="main-body-title-container">
                            <div class="main-body-title-left-container">
                                <h1 class="main-body-title">Fitness Podcasts</h1>
                            </div>
                            <div class="main-body-title-right-container">
                                <div class="back-to-category-container">
                                    <button class="back-to-category-button" href="#categorie" onclick="navigateTo('categories')"><i class="fa-solid fa-chevron-left" style="padding-right:5px;font-size:10px;"></i> Zurück zu Kategorien</button>
                                </div>
                            </div>   
                        </div>
                        <div class="main-body-line-container"></div>
                        <div class="main-body-main_page-container">
                            <div class="main-body-main_page-content">
                                <div class="loading" id="loading">
                                    <div class='session-renewed-container'>
                                        <div class='session-renewed-left-container'>
                                            <h1 class='session-renewed-left-text'>Podcasts laden...</h1>
                                        </div>
                                        <div class='session-renewed-right-container'>
                                            <div class="loading-animation-01-container">
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="category-page" id="category-page" style="display:none;">
                                    <div class="category-podcast-list"></div>
                                </div>
                                <div style="margin-bottom:125px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ` ;

            appDiv.innerHTML = content;

            fetchCategoryPodcasts(fitnessSubcategoryId).then(podcasts => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('category-page').style.display = 'block';
                const fitnessContent = generateCategoryPageContent(podcasts);
                document.querySelector('.category-podcast-list').innerHTML = fitnessContent;
            });
            break;

        case 'category-mental-health':
            const mentalhealthSubcategoryId = 134;

            content = `
                <div class="main-body-container">
                    <div class="main-body-content">
                        <div class="main-body-title-container">
                            <div class="main-body-title-left-container">
                                <h1 class="main-body-title">Mentale Gesundheit Podcasts</h1>
                            </div>
                            <div class="main-body-title-right-container">
                                <div class="back-to-category-container">
                                    <button class="back-to-category-button" href="#categorie" onclick="navigateTo('categories')"><i class="fa-solid fa-chevron-left" style="padding-right:5px;font-size:10px;"></i> Zurück zu Kategorien</button>
                                </div>
                            </div>   
                        </div>
                        <div class="main-body-line-container"></div>
                        <div class="main-body-main_page-container">
                            <div class="main-body-main_page-content">
                                <div class="loading" id="loading">
                                    <div class='session-renewed-container'>
                                        <div class='session-renewed-left-container'>
                                            <h1 class='session-renewed-left-text'>Podcasts laden...</h1>
                                        </div>
                                        <div class='session-renewed-right-container'>
                                            <div class="loading-animation-01-container">
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="category-page" id="category-page" style="display:none;">
                                    <div class="category-podcast-list"></div>
                                </div>
                                <div style="margin-bottom:125px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ` ;

            appDiv.innerHTML = content;

            fetchCategoryPodcasts(mentalhealthSubcategoryId).then(podcasts => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('category-page').style.display = 'block';
                const mentalhealthContent = generateCategoryPageContent(podcasts);
                document.querySelector('.category-podcast-list').innerHTML = mentalhealthContent;
            });
            break;
        case 'category-drama':
            const dramaSubcategoryId = 126;

            content = `
                <div class="main-body-container">
                    <div class="main-body-content">
                        <div class="main-body-title-container">
                            <div class="main-body-title-left-container">
                                <h1 class="main-body-title">Drama Podcasts</h1>
                            </div>
                            <div class="main-body-title-right-container">
                                <div class="back-to-category-container">
                                    <button class="back-to-category-button" href="#categorie" onclick="navigateTo('categories')"><i class="fa-solid fa-chevron-left" style="padding-right:5px;font-size:10px;"></i> Zurück zu Kategorien</button>
                                </div>
                            </div>   
                        </div>
                        <div class="main-body-line-container"></div>
                        <div class="main-body-main_page-container">
                            <div class="main-body-main_page-content">
                                <div class="loading" id="loading">
                                    <div class='session-renewed-container'>
                                        <div class='session-renewed-left-container'>
                                            <h1 class='session-renewed-left-text'>Podcasts laden...</h1>
                                        </div>
                                        <div class='session-renewed-right-container'>
                                            <div class="loading-animation-01-container">
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                                <div class="loading-animation-01-bar"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="category-page" id="category-page" style="display:none;">
                                    <div class="category-podcast-list"></div>
                                </div>
                                <div style="margin-bottom:125px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ` ;

            appDiv.innerHTML = content;

            fetchCategoryPodcasts(dramaSubcategoryId).then(podcasts => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('category-page').style.display = 'block';
                const dramaContent = generateCategoryPageContent(podcasts);
                document.querySelector('.category-podcast-list').innerHTML = dramaContent;
            });
            break;
        case 'categories':
            content = generateCategoriesPageContent();
            break;
        case 'favorites':
            content = `
        <div class="loading" id="loading" style="margin-top: 50px;">
            <div class='session-renewed-container'>
                <div class='session-renewed-left-container'>
                    <h1 class='session-renewed-left-text'>Favoriten laden...</h1>
                </div>
                <div class='session-renewed-right-container'>
                    <div class="loading-animation-01-container">
                        <div class="loading-animation-01-bar"></div>
                        <div class="loading-animation-01-bar"></div>
                        <div class="loading-animation-01-bar"></div>
                        <div class="loading-animation-01-bar"></div>
                        <div class="loading-animation-01-bar"></div>
                        <div class="loading-animation-01-bar"></div>
                        <div class="loading-animation-01-bar"></div>
                        <div class="loading-animation-01-bar"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
            document.getElementById('app').innerHTML = content;

            fetch('https://webengineering.ins.hs-anhalt.de:10062/auth/isLoggedIn', {
                method: 'GET',
                credentials: 'include'
            })
                .then(response => response.json())
                .then(loginData => {
                    const container = document.querySelector('#app');
                    container.innerHTML = '';

                    if (!loginData.loggedIn) {
                        container.innerHTML = `
                <div class="no-favorites-list-container">
                    <h1 class="no-favorites-list-title">Meine Favoriten</h1>
                    <p class="no-favorites-list-undertitle">Sie müssen eingeloggt sein, um Ihre Favoriten zu sehen. Bitte melden Sie sich an.</p>
                </div>
            `;
                        return;
                    }

                    return fetch('https://webengineering.ins.hs-anhalt.de:10062/auth/favorites', {
                        method: 'GET',
                        credentials: 'include'
                    });
                })
                .then(response => response.json())
                .then(favoriteData => {
                    if (!favoriteData || favoriteData.length === 0) {
                        document.getElementById('app').innerHTML = `
                <div class="no-favorites-list-container">
                    <h1 class="no-favorites-list-title">Meine Favoriten</h1>
                    <p class="no-favorites-list-undertitle">Derzeit haben Sie keine Favoriten. Besuchen Sie einen Podcast und fügen Sie ihn zu Ihren Favoriten hinzu.</p>
                </div>
            `;
                        return;
                    }

                    let content = `
            <div class="favorites-list-container">
                <h1 class="favorites-list-title">Meine Favoriten</h1>
                <ul class="favorites-list">
        `;

                    const fetchImagePromises = favoriteData.map(favorite => {
                        return fetch(`https://api.fyyd.de/0.2/podcast?podcast_id=${favorite.podcastId}`)
                            .then(response => response.json())
                            .then(data => {
                                const imageUrl = data.data ? data.data.layoutImageURL : 'default-image.jpg'; // Falls kein Bild gefunden wird
                                return { ...favorite, imageUrl };
                            })
                            .catch(error => {
                                console.error(`Fehler beim Abrufen des Bildes für Podcast ${favorite.podcastId}:`, error);
                                return { ...favorite, imageUrl: 'default-image.jpg' }; // Fehlerfall: Standardbild
                            });
                    });

                    Promise.all(fetchImagePromises).then(updatedFavorites => {
                        updatedFavorites.forEach(favorite => {
                            content += `
                    <li class="favorite-item">
                        <img class="podcast-image" src="${favorite.imageUrl}" alt="Podcast Bild" data-id="${favorite.podcastId}">
                        <button class="remove-button" title="Podcast aus der Favoriten Liste löschen" data-id="${favorite.podcastId}">x</button>
                    </li>
                `;
                        });

                        content += `</ul></div>`;
                        document.getElementById('app').innerHTML = content;

                        // Event Listener für "Entfernen"-Buttons
                        document.querySelectorAll('.remove-button').forEach(button => {
                            button.addEventListener('click', event => {
                                const podcastId = event.target.getAttribute('data-id');
                                removePodcastFromFavorites(podcastId);
                            });
                        });
                    });
                })
                .catch(error => {
                    console.error('Fehler beim Abrufen der Daten:', error);
                    document.getElementById('app').innerHTML = `
                    <div class="no-favorites-list-container">
                    <h1 class="no-favorites-list-title">Meine Favoriten</h1>
                    <p class="no-favorites-list-undertitle">Sie müssen eingeloggt sein, um Ihre Favoriten zu sehen. Bitte melden Sie sich an.</p>
                </div>
                    `;
                });
            break;
        case 'podcastDetail':
            if (!podcastData) {
                content = generateHomePageContent();
            } else {
                // DOMContentLoaded-Event-Listener hinzufügen
                document.addEventListener('DOMContentLoaded', () => {
                    renderEpisodes();
                });

                let description = podcastData.description ? podcastData.description : 'Keine Beschreibung ist bei dem Podcast verfügbar.';
                const encodedPodcastData = base64EncodeUnicode(JSON.stringify(podcastData));
                const podcastId = String(podcastData.id); // Konvertiere die ID in einen String

                content = `
                    <div class="main-body-container">
                        <div class="main-body-content">
                            <div class="podcastdetail-main-container">
                                <div class="podcastdetail-main-content">
                                    <div class="podcastdetail-left-container">
                                        <div class="podcastdetail-left-content">
                                            <img class="podcastdetail-img" src="${podcastData.layoutImageURL}" alt="${podcastData.title}">
                                        </div>
                                    </div>
                                    <div class="podcastdetail-right-container">
                                        <div class="podcastdetail-right-content">
                                            <h1 class="content-title">${podcastData.title}</h1>
                                            <p class="content-author">by ${podcastData.author}</p>
                                            <div class="content-description-container">
                                                <p class="content-description">${description}</p>
                                            </div>
                                            <div class="podcastdetail-right-content under-container">
                                                 <div class="podcastdetail-right-content under-left-container">  
                                                     <button class="content-playbutton"><i class="fa-solid fa-play"></i>Abspielen</button>
                                                 </div>
                                                 <div class="podcastdetail-right-content under-right-container">
                                                 </div>
                                             </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="podcastdetail-episode-list-container">
                                <div class="podcastdetail-episode-list-content">
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                isFavoritesLogged(podcastId);
            }
            break;
        case 'podcastSearch':
            content = `
                <div class="main-body-container">
                    <div class="main-body-content">
                        <div class="main-body-title-container">
                            <div class="main-body-title-left-container">
                                <h1 class="main-body-title">Suche dein Podcast</h1>
                            </div>
                            <div class="main-body-title-right-container"></div>
                        </div>
                        <div class="main-body-line-container"></div>
                        <div class="podcast-main-container">
                            <div class="podcast-main-content">
                                <div class="podcast-search-content">
                                    <div class="podcast-search-icon">
                                        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                                    </div>
                                    <div class="podcast-search-input-container">
                                        <input class="podcast-search-input" id="podcastSearchQuery" type="text" placeholder="Suche deine Lieblings Podcast">
                                    </div>
                                    <button class="podcast-search-button" onclick="handleSearchClick()">Suchen</button>
                                </div>
                                <div class="podcast-search-result-content"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;
        default:
            content = generateHomePageContent();
            setTimeout(loadSlider, 50);
            break;
    }


    appDiv.innerHTML = content;

    // Setzt den Event Listener NACH dem Einfügen des HTMLs
    if (page === 'register') {
        setRegisterFormListener();
    }

    if (page === 'login') {
        setLoginFormListener();
    }

    // Funktion geht wenn man auf der Account Verwaltung ist
    if (page === 'account-administration') {
        loadProfileData();
        setPasswordChangeFormListener();
    }

    if (page === 'podcastDetail' && podcastData) {
        renderEpisodes(podcastData);
    }

    if (page !== 'podcastDetail') {
        // Add click event listeners to navigation links
        const navLinks = document.querySelectorAll('.navigation a');
        navLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetPage = event.target.getAttribute('href').substring(1);
                navigateTo(targetPage);
            });
        });
    }

    updateHistoryState(page);
    setActiveSidebarButton(page);
}

function updateHistoryState(page) {
    history.replaceState(null, null, `index.html#${page}`);
}

function generateHomePageContent() {
    return `
        <div class="main-body-container">
            <div class="main-body-content">
                <div class="main-body-title-container">
                    <div class="main-body-title-left-container">                                                                 
                        <h1 class="main-body-title">Startseite</h1>
                    </div>
                    <div class="main-body-title-right-container">
                        <a role="link" href="#login" onclick="navigateToUserOrLogin()">
                            <i class="fa-solid fa-circle-user"></i>
                        </a>
                    </div>
                </div>
                <div class="main-body-line-container"></div>
                <div class="main-body-main_page-container">
                    <div class="main-body-main_page-content">
                        <div class="loading">
                            <div class='session-renewed-container'>
                                <div class='session-renewed-left-container'>
                                    <h1 class='session-renewed-left-text'>Podcasts laden...</h1>
                                </div>
                                <div class='session-renewed-right-container'>
                                    <div class="loading-animation-01-container">
                                        <div class="loading-animation-01-bar"></div>
                                        <div class="loading-animation-01-bar"></div>
                                        <div class="loading-animation-01-bar"></div>
                                        <div class="loading-animation-01-bar"></div>
                                        <div class="loading-animation-01-bar"></div>
                                        <div class="loading-animation-01-bar"></div>
                                        <div class="loading-animation-01-bar"></div>
                                        <div class="loading-animation-01-bar"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="main-body-main_page-slider-container">
                            <div class="header">
                                <h3 class="title">Neuesten Podcasts</h3>
                                <div class="progress-bar"></div>
                            </div>
                            <div class="main-body-main_page-slider-content">
                                <div class="test" style="position:relative">
                                    <div class="handle left-handle">
                                        <i class="fa-solid fa-chevron-left"></i>
                                    </div>
                                    <div class="row">
                                        <div class="container">
                                            <div class="slider"></div>
                                        </div>
                                    </div>
                                    <div class="handle right-handle">
                                        <i class="fa-solid fa-chevron-right"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="main-body-main_page-categories-help-container">
                            <h1 class="main-body-main_page-categories-help-title">Kategorien Vorschläge</h1>
                            <div class="main-body-main_page-categories-help-content">
                                <ul class="main-body-main_page-categories-help-list">
                                    <li class="main-body-main_page-categories-help-listitem" href="#category-fitness" onclick="navigateTo('category-fitness')">
                                        <a class="main-body-main_page-categories-help-listitem-container">
                                            <h1 class="main-body-main_page-categories-help-listitem-title">Fitness</h1>
                                            <i class="main-body-main_page-categories-help-listitem-icon fa-solid fa-chevron-right"></i>
                                        </a>
                                    </li>
                                    <li class="main-body-main_page-categories-help-listitem" href="#category-pets-animals" onclick="navigateTo('category-pets-animals')">
                                        <a class="main-body-main_page-categories-help-listitem-container">
                                            <h1 class="main-body-main_page-categories-help-listitem-title">Haustiere</h1>
                                            <i class="main-body-main_page-categories-help-listitem-icon fa-solid fa-chevron-right"></i>
                                        </a>
                                    </li>
                                    <li class="main-body-main_page-categories-help-listitem" href="#category-business-news" onclick="navigateTo('category-business-news')">
                                        <a class="main-body-main_page-categories-help-listitem-container">
                                            <h1 class="main-body-main_page-categories-help-listitem-title">Geschäftsnachrichten</h1>
                                            <i class="main-body-main_page-categories-help-listitem-icon fa-solid fa-chevron-right"></i>
                                        </a>
                                    </li>
                                    <li class="main-body-main_page-categories-help-listitem" href="#category-football" onclick="navigateTo('category-football')">
                                        <a class="main-body-main_page-categories-help-listitem-container">
                                            <h1 class="main-body-main_page-categories-help-listitem-title">Fussball</h1>
                                            <i class="main-body-main_page-categories-help-listitem-icon fa-solid fa-chevron-right"></i>
                                        </a>
                                    </li>
                                    <li class="main-body-main_page-categories-help-listitem" href="#category-video-games" onclick="navigateTo('category-video-games')">
                                        <a class="main-body-main_page-categories-help-listitem-container">
                                            <h1 class="main-body-main_page-categories-help-listitem-title">Videospiele</h1>
                                            <i class="main-body-main_page-categories-help-listitem-icon fa-solid fa-chevron-right"></i>
                                        </a>
                                    </li>
                                    <li class="main-body-main_page-categories-help-listitem" href="#category-drama" onclick="navigateTo('category-drama')">
                                        <a class="main-body-main_page-categories-help-listitem-container">
                                            <h1 class="main-body-main_page-categories-help-listitem-title">Drama</h1>
                                            <i class="main-body-main_page-categories-help-listitem-icon fa-solid fa-chevron-right"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateCategoriesPageContent() {
    return `
        <div class="main-body-container">
            <div class="main-body-content">
                <div class="main-body-categories-title">Kategorien</div>
                <div class="main-body-container">
                    <div class="main-body-content">
                        <div class="main-categories-container">
                            <div class="main-categories-content">
                                <div class="categories-layout-main-container">
                                    <div class="categories-layout-category-film-history categories-layout" href="#category-film-history" onclick="navigateTo('category-film-history')">    
                                        <p>Filmgeschichte</p>
                                    </div>
                                    <div class="categories-layout-category-wilderness categories-layout" href="#category-wilderness" onclick="navigateTo('category-wilderness')">    
                                        <p>Wildnis</p>
                                    </div>
                                    <div class="categories-layout-category-football categories-layout" href="#category-football" onclick="navigateTo('category-football')">    
                                        <p>Fussball</p>
                                    </div>
                                    <div class="categories-layout-category-religion categories-layout" href="#category-religion" onclick="navigateTo('category-religion')">    
                                        <p>Religion</p>
                                    </div>
                                    <div class="categories-layout-category-business-news categories-layout" href="#category-business-news" onclick="navigateTo('category-business-news')">    
                                        <p>Geschäftsnachrichten</p>
                                    </div>
                                    <div class="categories-layout-category-video-games categories-layout" href="#category-video-games" onclick="navigateTo('category-video-games')">    
                                        <p>Videospiele</p>
                                    </div>
                                    <div class="categories-layout-category-pets-animals categories-layout" href="#category-pets-animals" onclick="navigateTo('category-pets-animals')">    
                                        <p>Haustiere</p>
                                    </div>
                                    <div class="categories-layout-category-parenting categories-layout" href="#category-parenting" onclick="navigateTo('category-parenting')">    
                                        <p>Erziehung</p>
                                    </div>
                                    <div class="categories-layout-category-sexuality categories-layout" href="#category-sexuality" onclick="navigateTo('category-sexuality')">    
                                        <p>Sexualität</p>
                                    </div>
                                    <div class="categories-layout-mental-health categories-layout" href="#category-mental-health" onclick="navigateTo('category-mental-health')">    
                                        <p>Mentale Gesundheit</p>
                                    </div>
                                    <div class="categories-layout-fitness categories-layout" href="#category-fitness" onclick="navigateTo('category-fitness')">    
                                        <p>Fitness</p>
                                    </div>
                                    <div class="categories-layout-drama categories-layout" href="#category-drama" onclick="navigateTo('category-drama')">    
                                        <p>Drama</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}