(function() {
    const CAT_KEYS = [
        'catSmileys', 'catHearts', 'catGestures', 'catAnimals',
        'catFood', 'catActivities', 'catTransport', 'catObjects',
        'catPlaces', 'catNature'
    ];

    const CAT_EMOJIS = [
        '😀😃😄😁😆😅🤣😂🙂🙃😉😊😇🥰😍🤩😘😗😚😙🥲😋😛😜🤪😝🤑🤗🤭🫢🤫🤔🫡🤐🤨😐😑😶🫥😏😒🙄😬🤥😌😔😪🤤😴😷🤒🤕🤢🤮🤧🥵🥶🥴😵🤯🤠🥳🥸😎🤓🧐😕🫤😟🙁☹️😮😯😲😳🥺🥹😦😧😨😰😥😢😭😱😖😣😓😩😫🥱😤😡😠🤬😈👿💀☠️💩🤡👹👺👻👽👾🤖',
        '❤️🧡💛💚💙💜🖤🤍🤎💔❣️💕💞💓💗💖💘💝💟♥️',
        '👋🤚🖐️✋🖖👌🤏✌️🤞🤟🤘🤙👈👉👆🖕👇☝️👍👎✊👊🤛🤜👏🙌👐🤲🤝🙏✍️💪🦾🦿🦵🦶👂🦻👃🦷👀👁️👅👄💋🩸',
        '🐶🐱🐭🐹🐰🦊🐻🐼🐻‍❄️🐨🐯🦁🐮🐷🐸🐵🐔🐧🐦🐤🐣🐥🦆🦅🦉🦇🐺🐗🐴🦄🐝🪱🐛🦋🐌🐞🐜🪰🪲🪳🦂🕷️🐢🐍🦎🦖🦕🐙🦑🦐🦞🦀🐡🐠🐟🐬🐳🐋🦈🐊🐅🐆🦓🦍🦧🐘🦛🦏🐃🐂🐄🐎🐖🐏🐑🦙🐐🦌🐕🐩🦮🐕‍🦺🐈🐈‍⬛🪶🐓🦃🦤🦚🦜🦢🦩🕊️🐇🦝🦨🦡🦫🦦🥣🐁🐀🐿️🦔',
        '🍏🍐🍊🍋🍌🍉🍇🍓🍈🍒🍑🥭🍍🥥🥝🍅🍆🥑🥦🥬🥒🌶️🌽🥕🧄🧅🥔🍠🥐🥯🍞🥖🥨🧀🥚🍳🧈🥞🧇🥓🥩🍗🍖🦴🌭🍔🍟🍕🫓🥪🥙🧆🌮🌯🫔🥗🥘🥫🍝🍜🍲🍛🍣🍱🥟🦪🍤🍙🍚🍘🍥🥠🥮🍢🍡🍧🍨🍦🥧🍫🍬🍭🍮🍯🍼🥛☕🫖🍵🍶🍾🍷🍸🍹🍺🍻🥂🥃🥤🧋🧃🧉🧊🥢🍽️🍴🥄🔪🫙🏺',
        '⚽🏀🏈⚾🥎🎾🏐🏉🥏🎱🪀🏓🏸🏒🏑🥍🏏🥅⛳🪁🏹🎣🤿🥊🥋🎽🛹🛼🛷🥌🎿⛷️🏂🪂🏋️🤼🤸🤺⛹️',
        '🚗🚕🚙🚌🚎🏎️🚓🚑🚒🚐🛻🚚🚛🚜🛵🏍️🛺🚲🛴🛹🛼🛷🥌🎿⛷️🏂🪂🏋️🤼🤸🤺⛹️🚏🛣️🛤️🛢️⛽🚨🚥🚦🛑🚧⚓🛟🚤🛳️⛴️🛶📍🚢✈️🛩️🛫🛬🪂💺🚁🚟🚠🚡🛰️🚀🛸🛎️🧳⌛⏳⌚⏰⏱️⏲️🕰️🕛🕧🕐🕑🕒🕓🕔🕕🕖🕗🕘🕙🕚🕡🕠🕟🕞🕝🕜🕛🕚🕙🕘🕗🕖🕕🕔🕓🕒🕑🕐',
        '💡🔦🕯️📱📲💻🖥️🖨️⌨️🖱️🖲️💾💿📀📼📷📸📹🎥📽️🎞️📞☎️📟📠📺📻🎙️🎚️🎛️🧭⏱️⏲️⏰🕰️⌛⏳📡🔋🔌💰💴💵💶💷💸💳🧾💎⚖️🪜🧰🪛🔧🔨⛒️🛠️⛏️🪓⚙️🪤🔩⚙️🧲🔫💣🧨🪓🔪🗡️⚔️🛡️🚬⚰️🪦⚱️🏺🔮📿🧿🪬🧸🪆🪩🪪🪁🧵🪡🧶👓🕶️🥽🥼🦺👔👕👖🧣🧤🥧🦦👗👘🥻🩱🩲🩳👙👚👛👜👝🛍️🎒🩴👞👟🥾🥿👠👡🩰👢👑👒🎩🎓🧢🪖⛑️🛻📿💄💍💎🔇🔈🔉🔊📢📣📯🔔🔕🎼🎵🎶🎙️🎚️🎛️🎤🎧🎸🎹🎺🎻🪕🥁🪘📱📲☎️📟📠🔋🔌💻🖥️🖨️⌨️🖱️🖲️💽💾💿📀📼📷📸📹🎥📽️🎞️📞📟📠📺📻🎙️🎚️🎛️🧭',
        '🏠🏡🏘️🏚️🏗️🏭🏢🏬🏣🏤🏥🏦🏨🏪🏫🏬🏭🏯🏰💒🗼🗽⛪🕌🕍🛕🕋⛩️🛤️🛣️🗾🏔️⛰️🌋🗻🏕️🏖️🏜️🏝️🏞️🏟️🏛️🏗️🧱🪨🪵🛖',
        '☀️🌤️⛅🌥️☁️🌦️🌧️⛈️🌩️🌨️❄️☃️⛄🌬️💨🌪️🌫️🌊🌋🌇🌆🌃🏙️🌌🌠🎆🎇🌈🌅🌄🌅🌇🌉🎑🏔️⛰️🌋🗻🏕️🏖️🏜️🏝️🏞️🏟️🏛️🏗️🧱🪨🪵🛖'
    ];

    let activeCategory = 0;

    function t(key, fallback) {
        var val = I18N.t('tools.emoji.' + key);
        return val || fallback;
    }

    function init() {
        var searchInput = document.getElementById('emojiSearch');
        var categoryTabsEl = document.getElementById('categoryTabs');
        var emojiDisplayEl = document.getElementById('emojiDisplay');
        var statsInfoEl = document.getElementById('statsInfo');

        if (!searchInput || !categoryTabsEl || !emojiDisplayEl) return;

        renderCategories(categoryTabsEl, emojiDisplayEl, statsInfoEl, searchInput);
        renderEmojis(emojiDisplayEl, statsInfoEl, searchInput);

        searchInput.addEventListener('input', Utils.debounce(function() {
            renderEmojis(emojiDisplayEl, statsInfoEl, searchInput);
        }, 200));
    }

    function renderCategories(tabsEl, displayEl, statsEl, searchInput) {
        tabsEl.innerHTML = CAT_KEYS.map(function(key, i) {
            var name = t(key, key);
            return '<button class="category-tab' + (i === activeCategory ? ' active' : '') + '" data-index="' + i + '">' + name + '</button>';
        }).join('');

        tabsEl.querySelectorAll('.category-tab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                activeCategory = parseInt(tab.dataset.index);
                renderCategories(tabsEl, displayEl, statsEl, searchInput);
                renderEmojis(displayEl, statsEl, searchInput);
            });
        });
    }

    function renderEmojis(displayEl, statsEl, searchInput) {
        var query = (searchInput.value || '').trim().toLowerCase();
        var emojisToShow = [];

        if (query) {
            CAT_EMOJIS.forEach(function(emojis) {
                [...emojis].forEach(function(e) {
                    if (e.includes(query)) emojisToShow.push(e);
                });
            });

            var seen = {};
            emojisToShow = emojisToShow.filter(function(e) {
                if (seen[e]) return false;
                seen[e] = true;
                return true;
            });
        } else {
            emojisToShow = [...(CAT_EMOJIS[activeCategory] || '')];
        }

        statsEl.textContent = t('count', '{count} ' + emojisToShow.length) || (emojisToShow.length + ' emojis');

        displayEl.innerHTML = '';

        var grid = document.createElement('div');
        grid.className = 'emoji-grid';

        emojisToShow.forEach(function(emoji) {
            var cell = document.createElement('div');
            cell.className = 'emoji-cell';
            cell.textContent = emoji;
            cell.addEventListener('click', function() { copyEmoji(emoji); });
            grid.appendChild(cell);
        });

        if (emojisToShow.length === 0) {
            displayEl.innerHTML = '<div style="grid-column:1/-1;padding:40px;text-align:center;color:var(--text-light);font-size:14px;">' +
                (t('noMatch', 'No matching emojis')) + '</div>';
        } else {
            displayEl.appendChild(grid);
        }
    }

    function copyEmoji(emoji) {
        copyToClipboard(emoji, I18N.t('common.copied'));
        var toast = document.getElementById('copyToast');
        if (toast) {
            toast.classList.add('show');
            setTimeout(function() { toast.classList.remove('show'); }, 1500);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
