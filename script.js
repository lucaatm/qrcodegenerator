let qr;

        function updateSizeDisplay() {
            document.getElementById('sizeDisplay').innerText = document.getElementById('size').value;
        }

        function showFields() {
            const uc = document.getElementById('useCase').value;
            const f = document.getElementById('fields');
            f.innerHTML = '';
            if (uc === 'text') f.innerHTML = `<input id="textInput" placeholder="Text oder Link">`;
            if (uc === 'email') f.innerHTML = `<input id="emailTo" placeholder="Empfänger">
                                      <input id="emailSubject" placeholder="Betreff">
                                      <textarea id="emailBody" placeholder="Nachricht"></textarea>`;
            if (uc === 'phone') f.innerHTML = `<input id="phoneNumber" placeholder="Telefonnummer">`;
            if (uc === 'sms') f.innerHTML = `<input id="smsNumber" placeholder="Telefonnummer">
                                   <textarea id="smsMessage" placeholder="Nachricht"></textarea>`;
            if (uc === 'wifi') f.innerHTML = `<input id="wifiSSID" placeholder="SSID">
                                    <input id="wifiType" placeholder="Verschlüsselung (WPA/WEP/nicht)">
                                    <input id="wifiPass" placeholder="Passwort">`;
        }

        function applyPreset() {
            const p = document.getElementById('preset').value;
            if (p === 'classic') { fgPickr.setColor("#000"); bgPickr.setColor("#fff"); }
            if (p === 'invert') { fgPickr.setColor("#fff"); bgPickr.setColor("#000"); }
            if (p === 'blue') { fgPickr.setColor("#00f"); bgPickr.setColor("#ff0"); }
            if (p === 'green') { fgPickr.setColor("#008000"); bgPickr.setColor("#eee"); }
        }

        function swapColors() {
            const fg = getFgColor(), bg = getBgColor();
            fgPickr.setColor(bg);
            bgPickr.setColor(fg);
        }

        function buildContent() {
            const uc = document.getElementById('useCase').value;
            if (uc === 'text') return document.getElementById('textInput').value.trim();
            if (uc === 'email') {
                const to = document.getElementById('emailTo').value.trim();
                const subj = encodeURIComponent(document.getElementById('emailSubject').value.trim());
                const body = encodeURIComponent(document.getElementById('emailBody').value.trim());
                return `mailto:${to}?subject=${subj}&body=${body}`;
            }
            if (uc === 'phone') return `tel:${document.getElementById('phoneNumber').value.trim()}`;
            if (uc === 'sms') {
                const num = document.getElementById('smsNumber').value.trim();
                const msg = encodeURIComponent(document.getElementById('smsMessage').value.trim());
                return `SMSTO:${num}:${msg}`;
            }
            if (uc === 'wifi') {
                const ssid = document.getElementById('wifiSSID').value.trim();
                const type = document.getElementById('wifiType').value.trim();
                const pass = document.getElementById('wifiPass').value.trim();
                return `WIFI:S:${ssid};T:${type};P:${pass};;`;
            }
            return '';
        }

        function generateQRCode() {
            const content = buildContent();
            if (!content) { alert("Bitte alle notwendigen Felder ausfüllen."); return; }

            document.getElementById('qrcode').innerHTML = '';
            qr = new QRCode(document.getElementById('qrcode'), {
                text: content,
                width: parseInt(document.getElementById('size').value),
                height: parseInt(document.getElementById('size').value),
                colorDark: getFgColor(),
                colorLight: getBgColor()
            });
        }

        function downloadQRCode() {
            if (!qr) { alert("Bitte zuerst generieren."); return; }
            const fmt = document.getElementById('format').value;
            const canvas = document.getElementById('qrcode').querySelector('canvas');
            const mime = fmt === 'jpeg' ? 'image/jpeg' : 'image/png';
            const ext = fmt === 'jpeg' ? 'jpg' : 'png';
            const data = canvas.toDataURL(mime);
            const a = document.createElement('a');
            a.href = data; a.download = `qrcode.${ext}`; a.click();
        }

        let fgPickr = Pickr.create({
            el: '#fgPickr',
            theme: 'classic',
            default: '#000000',
            components: {
                preview: true,
                opacity: false,
                hue: true,
                interaction: {
                    input: true,
                    save: true
                }
            }
        });

        let bgPickr = Pickr.create({
            el: '#bgPickr',
            theme: 'classic',
            default: '#ffffff',
            components: {
                preview: true,
                opacity: false,
                hue: true,
                interaction: {
                    input: true,
                    save: true
                }
            }
        });

        function getFgColor() {
            return fgPickr.getColor().toHEXA().toString();
        }

        function getBgColor() {
            return bgPickr.getColor().toHEXA().toString();
        }

        showFields();
        updateSizeDisplay();