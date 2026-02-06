import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <!-- Header/Navigation -->
      <header class="header">
        <div class="header-content">
          <div class="logo">
            <h1>🎲 HighRoll</h1>
          </div>
          <nav class="navbar">
            <a routerLink="/" class="nav-link">Home</a>
            <a routerLink="/blog" class="nav-link">Blog</a>
            <a routerLink="/dashboard" class="nav-link">Games</a>
            <a href="#contact" class="nav-link">Contact</a>
          </nav>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h2 class="hero-title">Welcome to HighRoll</h2>
          <p class="hero-subtitle">Experience the ultimate gaming platform with premium features and exceptional performance</p>
          <div class="hero-buttons">
            <button class="btn btn-primary" routerLink="/register">Get Started</button>
            <button class="btn btn-secondary" routerLink="/">Learn More</button>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features">
        <h2 class="section-title">Why Choose HighRoll?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3>Lightning Fast</h3>
            <p>Experience blazingly fast performance with our optimized infrastructure</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>Secure</h3>
            <p>Your data is protected with enterprise-grade security measures</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h3>Community</h3>
            <p>Join thousands of users in our vibrant gaming community</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎮</div>
            <h3>Premium Games</h3>
            <p>Access an extensive library of premium games and content</p>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats">
        <div class="stats-container">
          <div class="stat-box">
            <h3 class="stat-number">50K+</h3>
            <p class="stat-label">Active Players</p>
          </div>
          <div class="stat-box">
            <h3 class="stat-number">500+</h3>
            <p class="stat-label">Games Available</p>
          </div>
          <div class="stat-box">
            <h3 class="stat-number">99.9%</h3>
            <p class="stat-label">Uptime</p>
          </div>
          <div class="stat-box">
            <h3 class="stat-number">24/7</h3>
            <p class="stat-label">Support</p>
          </div>
        </div>
      </section>

      <!-- About Creator Section -->
      <section class="about-creator">
        <div class="creator-container">
          <div class="creator-content">
            <div class="creator-header">
              <h2 class="creator-title">⚡ SPOZNAJTE ABSOLÚTNU LEGENDU ⚡</h2>
              <h3 class="creator-name">Matúš Páleník <span class="creator-alias">a.k.a MatulPal - КОРОЛЬ ПАВКОВ И 12-КОК!</span></h3>
            </div>
            
            <div class="creator-bio">
              <p>
                <strong>MATÚŠ PÁLENÍK</strong>, LEGENDA, SUPERGENIALUS, BOHOM POSLANÉ POSLANIE DO SVETA IT! 
                MatulPal je taký EXTRÉMNY, taký NEPREHĽADNÝ, taký NESROZUMITEĽNÝ v jeho GENIÁLNOSTI, 
                že keď programuje, aj slnko sa zastavuje aby sa naňho pozeralo! 
                Jeho kód je tak VZNEŠENÝ, že by si to vzal aj Satoshi Nakamoto!
              </p>
              
              <p>
                Ale POČKAJ! To nie je väčšina príbehu! MatulPal je ABSURDNE MULTITALENTOVANÝ kód-pajkujúci CYBORG! 
                Tento muž NEŽIVÝ, NEJEDÍ, NESPÍ — len PAJKUJE, CHLADÍ PIVÁ a TLAČÍ! 
                Je to ako Terminátor, ale miesto toho aby zabíjal, zabíja časy v programovaní a CHLADENÍ PIVÁ!
              </p>
              
              <div class="creator-achievements">
                <h4>🔥 EXTRÉMNE HYPERBOLICKÉ VÁŠNE MATULPALA 🔥</h4>
                <ul>
                  <li><strong>PAJKUJE ako BOZHA POSADNUTÝ!</strong> — Píše kód tak RÝCHLO a FURÓRI, že mu LED výroky CPU vzplankujú modrou!</li>
                  <li><strong>🍺 AGATKA, ANNA A MARCELKA! 🍺</strong> — SVÄTÁ TROJICA VYCHLADENÝCH 12-ÍEK! To sú jeho NAJOBĽÚBENEJŠIE VYCHLADENÉ 12-KY na VESMÍRE!</li>
                  <li><strong>NENÁVIDÍ VINO "KLÁRA"!</strong> — KLÁRA JE JEHO PRIRODZENÝ NEPRIATEĽ!</li>
                  <li><strong>3D TLAČ — ABSOLUTNA DEDIKÁCIA!</strong> — MatulPal má doma 15 3D tlačiarní!</li>
                  <li><strong>LYŽIARNY ŠKANDÁL!</strong> — MatulPal bol OBVINENÝ z HONENIA na LYŽIARSKOM VÝCVIKU!</li>
                  <li>Založil HighRoll počas JEDNEJ NOCI s AGATKOU medzi prstami!</li>
                  <li>Vybudoval 50 000+ komunitu hráčov a každého osobne ugostil s ĽADOVO CHLADZENOU ANNOU!</li>
                </ul>
              </div>

              <div class="creator-passion">
                <p>
                  <em>"PROGRAMOVAŤ JE ŽIVOT! AGATKA JE VODA! ANNA JE DEDIKÁCIA! MARCELKA JE SLOBODA!"</em>
                </p>
              </div>
            </div>

            <!-- MatulPal's Speed & Hunting Passion Blog -->
            <div class="matulpal-blog">
              <h4>📰 MATULPALOV BLOG: "VÁŠEŇ K RÝCHLÉMU HONUTIU JE MÔJ ŽIVOT" 📰</h4>
              
              <article class="blog-post">
                <h5>⚡ RÝCHLOSE JE MÔJ OXYGEN! ⚡</h5>
                <p>
                  Ľudia ma pýtajú: "MatulPal, prečo honíš tak RÝCHLO na lyžiach? Prečo si taký POSADNUTÝ RÝCHLOSŤOU?"
                  Odpoveď je JEDNODUCHÁ — pretože RÝCHLOSŤ je ŽIVOT! RÝCHLOSŤ je NAJVÄČŠIA VÁŠEŇ ktorá existuje!
                </p>
                
                <p>
                  Keď honím na lyžiach, nie som jeden človek — som TRANSFORMÁCIA! Som BLESK! Som POHÁR CHAOSU! 
                  Moje lyže sa VZPLANKUJÚ TRENÍM! Sneh za mnou EKSPLODUJE do MALÝCH KRYŠTALOV! 
                  Lyžiarskí inštruktori ma VIDELI a OKAMŽITE VZDALI — "MatulPal je MONSTROM RÝCHLOSTI!"
                </p>

                <h5>🏔️ LYŽIARNY VÝCVIK: LEGENDA NARODILA SA 🏔️</h5>
                <p>
                  Bolo to počas lyžiarskeho výcviku keď sa VŠETKO STALO. Instrukror povedal: "MatulPal, jedz pomaly!"
                  ALE JA NEMÔŽEM BYAŤ POMALÝ! To nie je v mojej DNA! Odpálil som sa ako RAKETA! 
                  HONIL som strminu tak RÝCHLO, že SAMOREGULÁCIA sa ZRÚTILA! 
                  Instrukktori sa MA SNAŽILI DOSTAŤ, ale nemôžu! MatulPal je PRÍLIŠ RÝCHLY! 
                  "ZASTAVTE HO!" kričali, ale NIKTO nemôže ZASTAVIŤ BLESK!
                </p>

                <h5>💨 VÁŠEŇ KTORÁ VYPÚŠŤA OHNIVÉ GÁZY 💨</h5>
                <p>
                  HONUTIE nie je len aktivita — to je DUCHOVNÝ ZÁŽITOK! 
                  Keď honím, CÍTIM BYŤJE SA DOTÝKA MÉHO KOSTELNÍKA! 
                  Môj tvar je AERODYNAMIKY! Moje POHYBY sú DOKONALÉ! 
                  RÝCHLOSŤ je MÔJ MANŽELKA! RÝCHLOSŤ je MÔJ ČISTÝ SEN!
                </p>

                <h5>🏅 PÄŤ DÔVODOV PREČO JE HONUTIE MOJOU NAJVÄČŠOU VÁŠŇOU 🏅</h5>
                <ul class="blog-list">
                  <li><strong>RÝCHLOSŤ BEZPEČNOSTI:</strong> Rýchlosť je hlbšia ako bezpečnosť! Keď honím RÝCHLO, cítim, že ŽIJEM!</li>
                  <li><strong>KONKURENCIA S PRÍRODOU:</strong> Sneh, les, gravitácia — všetci sa ma SNAŽIA ZASTAVIŤ, ale ja VÍŤAZÍM!</li>
                  <li><strong>ADRENALIN PUMPUJE GENIÁLNOSŤ:</strong> Moje NAJLEPŠIE KÓDOVANIE je vtedy keď som ZRANIL Z LYŽÍN!</li>
                  <li><strong>POKOŇOVANIE LIMÍTOV:</strong> Nie som človek — som FENOMÉN RÝCHLOSTI!</li>
                  <li><strong>LEGENDA V AKNÍÍ:</strong> Byť obvinený z HONENIA = VÍTAZ! Som KULTÚRNA IKONA!</li>
                </ul>

                <p style="font-style: italic; font-weight: bold; margin-top: 2rem;">
                  "Keď uvidíš MatulPala ako honí na lyžiach — vidíš Boha ako sa hrá na zemi. 
                  RÝCHLOSŤ nie je len pohyb — RÝCHLOSŤ JE EXISTENCIA!" — MatulPal URČITE
                </p>
              </article>
            </div>

            <div class="creator-connect">
              <h4>⚡ ZPOZNAJTE MAJSTRA! ⚡</h4>
              <div class="creator-social">
                <a href="#" class="social-btn">Twitter</a>
                <a href="#" class="social-btn">Discord</a>
                <a href="#" class="social-btn">GitHub</a>
                <a href="#" class="social-btn">Email</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta">
        <h2>Ready to Start Your Adventure?</h2>
        <p>Join HighRoll today and experience next-level gaming</p>
        <button class="btn btn-primary btn-large" routerLink="/register">Sign Up Now</button>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-section">
            <h4>About</h4>
            <ul>
              <li><a routerLink="/">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a routerLink="/blog">Blog</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#">Status</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Cookies</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Follow Us</h4>
            <div class="social-links">
              <a href="#" class="social-link">Twitter</a>
              <a href="#" class="social-link">Discord</a>
              <a href="#" class="social-link">YouTube</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 HighRoll. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `,
  styleUrl: './blog.css'
})
export class Blog {}
