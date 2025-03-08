let created = false;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.message === 'build_cards' && !created) {
        created = true;
        const dubEnabled = request.dubEnabled;
        const subbedEnabled = request.subbedEnabled;
        let currentIndexDub = 0;
        let currentIndexSub = 0;
        const batchSize = 5;
        chrome.storage.local.get(["dubbed_series", "subbed_series"], (result) => {
            const dubbedSeriesTotal = result.dubbed_series;
            const subbedSeriesTotal = result.subbed_series;
            let dubbedSeries = result.dubbed_series;
            let subbedSeries = result.subbed_series;

            if (dubEnabled) {
                const customDivDub = document.createElement("div");
                customDivDub.innerHTML = `
                  <div id="dubbed-series">
                     <div class="container--cq5XE">
                        <div class="feed-header--ihqym">
                           <h2 class="heading--nKNOf heading--is-bold--DUljF heading--is-m--7bv3g heading--is-family-type-one--GqBzU feed-header__title--DMRD6">Dubbed series</h2>
                        </div>
                        <div class="erc-search-field">
                            <div class="content-wrapper--MF5LS">
                                <div class="search-input-wrapper">
                                    <input aria-label="search" placeholder="Search..." class="search-input search-input-dub" type="text" value="">
                                </div>
                            </div>
                        </div>
                        <div class="erc-watchlist-collection erc-watchlist-collection-dub" data-t="watchlist">
                        </div>
                        <div class="container--cq5XE show-more-container-dub" style="display: none">
                            <div class="erc-view-all-feed-section">
                                <button tabindex="0" class="button--xqVd0 button--is-type-one-weak--KLvCX show-more-dub">
                                    <span class="call-to-action--PEidl call-to-action--is-m--RVdkI button__cta--LOqDH">Show More</span>
                                </button>
                            </div>
                        </div>
                     </div>
                  </div>
                `;

                document.querySelector('.dynamic-feed-wrapper').appendChild(customDivDub);

                const watchlistCollectionDub = customDivDub.querySelector('.erc-watchlist-collection-dub');
                const initialSeriesDub = dubbedSeries.slice(0, batchSize);
                const searchDub = document.querySelector('.search-input-dub');

                searchDub.addEventListener('input', (event) => {
                    const inputValue = event.target.value;
                    dubbedSeries = dubbedSeriesTotal.filter(item => item.title.toLowerCase().includes(inputValue.toLowerCase()));
                    watchlistCollectionDub.innerHTML = '';
                    currentIndexDub = addMore(dubbedSeries, 0, batchSize, watchlistCollectionDub, addMoreContainerDub);

                    if(dubbedSeries.length > batchSize) {
                        addMoreContainerDub.style.display = 'block';
                    } else {
                        addMoreContainerDub.style.display = 'none';
                    }
                });

                initialSeriesDub.forEach(item => {
                    currentIndexDub++;
                    const seriesItem = document.createElement("div");
                    seriesItem.classList.add("collection-item");
                    seriesItem.style.display = "block";
                    seriesItem.innerHTML = `
                    <div class="watchlist-card--YfKgo" data-t="watch-list-card"><a tabindex="0" class="watchlist-card__content-link--Ujiaq" title="${item.title}" href="/it/watch/${item.id}/${item.slug_title}"></a>
                        <div class="watchlist-card-image--CMvVM">
                            ${item.new ? '<div class="content-tags-group--0ckbD watchlist-card-image__tags--cnj48">' +
                        '<div class="info-tag--iCqCs info-tag--is-one--Q6iut content-tags-group__item--rJ2ZA" data-t="info-tag-new"><small class="text--gq6o- text--is-heavy--2YygX text--is-xs--5PTBo info-tag__item--avQcC">Nuovo</small></div>' +
                        '</div>' : ''}
                            <div class="content-image--3na7E content-image--is-sized--SOai1 watchlist-card-image__poster--W-MSe">
                                <div class="content-image-figure-wrapper--pKs17 content-image__figure-wrapper--TRCnl">
                                    <div class="content-image-figure-wrapper__figure-sizer--SH2-x content-image__figure-sizer--is-background-type-one--Eo1qr"><svg class="content-image-figure-wrapper__sizer---PAKo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 3"></svg>
                                        <figure class="content-image__figure--7vume">
                                            <div class="progressive-image-loading--rwH3R">
                                                <picture><img class="progressive-image-base__fade--Nrn20 progressive-image-base__fade--is-ready--dMxKu content-image__image--7tGlg progressive-image-loading__preview--eYvnH progressive-image-loading__preview--is-hidden--RLDT9" loading="lazy" src="${item.images.poster_wide[0][3].source}" alt="${item.title}" data-t="preview-image"></picture>
                                                <picture><img class="content-image__image--7tGlg progressive-image-loading__original--k-k-7" loading="lazy" src="${item.images.poster_wide[0][3].source}" alt="${item.title}" data-t="original-image"></picture>
                                            </div>
                                        </figure>
                                    </div>
                                </div>
                            </div>
                            <div class="content-image--3na7E content-image--is-sized--SOai1 watchlist-card-image__thumbnail--OD-tH">
                                <div class="content-image-figure-wrapper--pKs17 content-image__figure-wrapper--TRCnl">
                                    <div class="content-image-figure-wrapper__figure-sizer--SH2-x content-image__figure-sizer--is-background-type-one--Eo1qr"><svg class="content-image-figure-wrapper__sizer---PAKo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"></svg>
                                        <figure class="content-image__figure--7vume">
                                            <div class="progressive-image-loading--rwH3R">
                                                <picture><img class="progressive-image-base__fade--Nrn20 progressive-image-base__fade--is-ready--dMxKu content-image__image--7tGlg progressive-image-loading__preview--eYvnH progressive-image-loading__preview--is-hidden--RLDT9" loading="eager" src="${item.images.poster_wide[0][3].source}" alt="${item.title}" data-t="preview-image"></picture>
                                                <picture><img class="content-image__image--7tGlg progressive-image-loading__original--k-k-7" loading="eager" src="${item.images.poster_wide[0][3].source}" alt="${item.title}" data-t="original-image"></picture>
                                            </div>
                                        </figure>
                                    </div>
                                </div>
                            </div>
                            <div class="playable-thumbnail--HKMt2 watchlist-card-image__playable-thumbnail--4RQJC">
                                <div class="content-image--3na7E content-image--is-background-type-one--1LQDe playable-thumbnail__image--AgM1B">
                                    <figure class="content-image__figure--7vume">
                                        <div class="progressive-image-loading--rwH3R">
                                            <picture><img class="progressive-image-base__fade--Nrn20 progressive-image-base__fade--is-ready--dMxKu content-image__image--7tGlg progressive-image-loading__preview--eYvnH progressive-image-loading__preview--is-hidden--RLDT9" loading="eager" src="${item.images.poster_wide[0][3].source}" alt="${item.title}" data-t="card-image"></picture>
                                            <picture><img class="content-image__image--7tGlg progressive-image-loading__original--k-k-7" loading="eager" src="${item.images.poster_wide[0][3].source}" alt="${item.title}" data-t="card-image"></picture>
                                        </div>
                                    </figure>
                                </div>
                                <div class="playable-thumbnail-icon--is-hovered--BKdRL">
                                    <div class="playable-thumbnail-icon__play-overlay--vzI7I">
                                        <div class="play-media-icon--CpSht play-media-icon--is-scalable--ZPGW9" data-t="playable-icon"><svg class="play-media-icon__symbol--feBy-" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-t="play-filled-svg" aria-labelledby="play-filled-svg" aria-hidden="true" role="img">
                                            <title id="play-filled-svg">Play</title>
                                            <path d="m4 2 16 10L4 22z"></path>
                                        </svg></div>
                                    </div>
                                </div>
                                <div class="content-tags-group--0ckbD playable-thumbnail__tags--wNuh1"></div>
                                <div class="text--gq6o- text--is-semibold--AHOYN text--is-m--pqiL- playable-thumbnail__duration--p-Ldq" data-t="duration-info">${item.series_metadata.series_launch_year}</div>
                            </div>
                        </div>
                        <div class="watchlist-card-body--ZpYFy" style="display: none">
                            <a tabindex="0" class="watchlist-card-title--o1sAO" href="/it/series/${item.id}/${item.slug_title}">
                            <h4 class="text--gq6o- text--is-semibold--AHOYN text--is-l--iccTo watchlist-card-title__text--chGlt">${item.title}</h4></a>
                            <h5 class="text--gq6o- text--is-m--pqiL- watchlist-card-subtitle--IROsU">Click to watch</h5>
                            <div class="watchlist-card-body-footer--bNjMg">
                                <div class="meta-tags--o8OYw" data-t="meta-tags">
                                    <div class="meta-tags__tag-wrapper--fzf-1 meta-tags__tag-wrapper--is-inline--ug1Il"><span class="text--gq6o- text--is-m--pqiL-">Dubbed</span></div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    watchlistCollectionDub.appendChild(seriesItem);
                });

                const addMoreButtonDub = customDivDub.querySelector('.show-more-dub');
                const addMoreContainerDub = customDivDub.querySelector('.show-more-container-dub');
                if(dubbedSeries.length > batchSize - 1) {
                    addMoreContainerDub.style.display = 'block';
                }
                addMoreButtonDub.addEventListener('click', () => {
                    currentIndexDub = addMore(dubbedSeries, currentIndexDub, batchSize, watchlistCollectionDub, addMoreContainerDub);
                });
            }

            if (subbedEnabled) {
                const customDivSub = document.createElement("div");
                customDivSub.innerHTML = `
                  <div id="subbed-series">
                     <div class="container--cq5XE">
                        <div class="feed-header--ihqym">
                           <h2 class="heading--nKNOf heading--is-bold--DUljF heading--is-m--7bv3g heading--is-family-type-one--GqBzU feed-header__title--DMRD6">Subbed series</h2>
                        </div>
                        <div class="erc-search-field">
                            <div class="content-wrapper--MF5LS">
                                <div class="search-input-wrapper">
                                    <input aria-label="search" placeholder="Search..." class="search-input search-input-sub" type="text" value="">
                                </div>
                            </div>
                        </div>
                        <div class="erc-watchlist-collection erc-watchlist-collection-sub" data-t="watchlist">
                        </div>
                        <div class="container--cq5XE show-more-container-sub" style="display: none">
                            <div class="erc-view-all-feed-section">
                                <button tabindex="0" class="button--xqVd0 button--is-type-one-weak--KLvCX show-more-sub">
                                    <span class="call-to-action--PEidl call-to-action--is-m--RVdkI button__cta--LOqDH">Show More</span>
                                </button>
                            </div>
                        </div>
                     </div>
                  </div>
                `;

                document.querySelector('.dynamic-feed-wrapper').appendChild(customDivSub);
                const watchlistCollectionSub = customDivSub.querySelector('.erc-watchlist-collection-sub');
                const initialSeriesSub = dubbedSeries.slice(0, batchSize);
                const searchSub = document.querySelector('.search-input-sub');

                searchSub.addEventListener('input', (event) => {
                    const inputValue = event.target.value;
                    subbedSeries = subbedSeriesTotal.filter(item => item.title.toLowerCase().includes(inputValue.toLowerCase()));
                    watchlistCollectionSub.innerHTML = '';
                    currentIndexSub = addMore(subbedSeries, 0, batchSize, watchlistCollectionSub, addMoreContainerSub);

                    if(subbedSeries.length > batchSize) {
                        addMoreContainerSub.style.display = 'block';
                    } else {
                        addMoreContainerSub.style.display = 'none';
                    }
                });

                initialSeriesSub.forEach(item => {
                    currentIndexSub++;
                    const seriesItem = document.createElement("div");
                    seriesItem.classList.add("collection-item");
                    seriesItem.style.display = "block";
                    seriesItem.innerHTML = `
                    <div class="watchlist-card--YfKgo" data-t="watch-list-card"><a tabindex="0" class="watchlist-card__content-link--Ujiaq" title="${item.title}" href="/it/watch/${item.id}/${item.slug_title}"></a>
                        <div class="watchlist-card-image--CMvVM">
                            ${item.new ? '<div class="content-tags-group--0ckbD watchlist-card-image__tags--cnj48">' +
                        '<div class="info-tag--iCqCs info-tag--is-one--Q6iut content-tags-group__item--rJ2ZA" d=ata-t"info-tag-new"><small class="text--gq6o- text--is-heavy--2YygX text--is-xs--5PTBo info-tag__item--avQcC">Nuovo</small></div>' +
                        '</div>' : ''}
                            <div class="content-image--3na7E content-image--is-sized--SOai1 watchlist-card-image__poster--W-MSe">
                                <div class="content-image-figure-wrapper--pKs17 content-image__figure-wrapper--TRCnl">
                                    <div class="content-image-figure-wrapper__figure-sizer--SH2-x content-image__figure-sizer--is-background-type-one--Eo1qr"><svg class="content-image-figure-wrapper__sizer---PAKo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 3"></svg>
                                        <figure class="content-image__figure--7vume">
                                            <div class="progressive-image-loading--rwH3R">
                                                <picture><img class="progressive-image-base__fade--Nrn20 progressive-image-base__fade--is-ready--dMxKu content-image__image--7tGlg progressive-image-loading__preview--eYvnH progressive-image-loading__preview--is-hidden--RLDT9" loading="lazy" src="${item.images.poster_wide[0][3].source}" alt="${item.title}" data-t="preview-image"></picture>
                                                <picture><img class="content-image__image--7tGlg progressive-image-loading__original--k-k-7" loading="lazy" src="${item.images.poster_wide[0][3].source}" alt="${item.title}" data-t="original-image"></picture>
                                            </div>
                                        </figure>
                                    </div>
                                </div>
                            </div>
                            <div class="content-image--3na7E content-image--is-sized--SOai1 watchlist-card-image__thumbnail--OD-tH">
                                <div class="content-image-figure-wrapper--pKs17 content-image__figure-wrapper--TRCnl">
                                    <div class="content-image-figure-wrapper__figure-sizer--SH2-x content-image__figure-sizer--is-background-type-one--Eo1qr"><svg class="content-image-figure-wrapper__sizer---PAKo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"></svg>
                                        <figure class="content-image__figure--7vume">
                                            <div class="progressive-image-loading--rwH3R">
                                                <picture><img class="progressive-image-base__fade--Nrn20 progressive-image-base__fade--is-ready--dMxKu content-image__image--7tGlg progressive-image-loading__preview--eYvnH progressive-image-loading__preview--is-hidden--RLDT9" loading="eager" src="${item.images.poster_wide[0][3].source}" alt="${item.title}" data-t="preview-image"></picture>
                                                <picture><img class="content-image__image--7tGlg progressive-image-loading__original--k-k-7" loading="eager" src="${item.images.poster_wide[0][3].source}" alt="${item.title}" data-t="original-image"></picture>
                                            </div>
                                        </figure>
                                    </div>
                                </div>
                            </div>
                            <div class="playable-thumbnail--HKMt2 watchlist-card-image__playable-thumbnail--4RQJC">
                                <div class="content-image--3na7E content-image--is-background-type-one--1LQDe playable-thumbnail__image--AgM1B">
                                    <figure class="content-image__figure--7vume">
                                        <div class="progressive-image-loading--rwH3R">
                                            <picture><img class="progressive-image-base__fade--Nrn20 progressive-image-base__fade--is-ready--dMxKu content-image__image--7tGlg progressive-image-loading__preview--eYvnH progressive-image-loading__preview--is-hidden--RLDT9" loading="eager" src="${item.images.poster_wide[0][3].source}" alt="${item.title}" data-t="card-image"></picture>
                                            <picture><img class="content-image__image--7tGlg progressive-image-loading__original--k-k-7" loading="eager" src="${item.images.poster_wide[0][3].source}" alt="${item.title}" data-t="card-image"></picture>
                                        </div>
                                    </figure>
                                </div>
                                <div class="playable-thumbnail-icon--is-hovered--BKdRL">
                                    <div class="playable-thumbnail-icon__play-overlay--vzI7I">
                                        <div class="play-media-icon--CpSht play-media-icon--is-scalable--ZPGW9" data-t="playable-icon"><svg class="play-media-icon__symbol--feBy-" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-t="play-filled-svg" aria-labelledby="play-filled-svg" aria-hidden="true" role="img">
                                            <title id="play-filled-svg">Play</title>
                                            <path d="m4 2 16 10L4 22z"></path>
                                        </svg></div>
                                    </div>
                                </div>
                                <div class="content-tags-group--0ckbD playable-thumbnail__tags--wNuh1"></div>
                                <div class="text--gq6o- text--is-semibold--AHOYN text--is-m--pqiL- playable-thumbnail__duration--p-Ldq" data-t="duration-info">${item.series_metadata.series_launch_year}</div>
                            </div>
                        </div>
                        <div class="watchlist-card-body--ZpYFy"><a tabindex="0" class="watchlist-card-title--o1sAO" href="/it/series/${item.id}/${item.slug_title}">
                            <h4 class="text--gq6o- text--is-semibold--AHOYN text--is-l--iccTo watchlist-card-title__text--chGlt">${item.title}</h4>
                        </a>
                            <h5 class="text--gq6o- text--is-m--pqiL- watchlist-card-subtitle--IROsU">Click to watch</h5>
                            <div class="watchlist-card-body-footer--bNjMg">
                                <div class="meta-tags--o8OYw" data-t="meta-tags">
                                    <div class="meta-tags__tag-wrapper--fzf-1 meta-tags__tag-wrapper--is-inline--ug1Il"><span class="text--gq6o- text--is-m--pqiL-">Subbed</span></div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    watchlistCollectionSub.appendChild(seriesItem);
                });

                const addMoreButtonSub = customDivSub.querySelector('.show-more-sub');
                const addMoreContainerSub = customDivSub.querySelector('.show-more-container-sub');
                if(subbedSeries.length > batchSize - 1) {
                    addMoreContainerSub.style.display = 'block';
                }
                addMoreButtonSub.addEventListener('click', () => {
                    currentIndexSub = addMore(subbedSeries, currentIndexSub, batchSize, watchlistCollectionSub, addMoreContainerSub);
                });
            }
        });

        function addMore(series, currentIndex, batchSize, watchlistCollection, addMoreContainer) {
            const moreSeries = series.slice(currentIndex, currentIndex + batchSize);
            moreSeries.forEach(item => {
                currentIndex++;
                const seriesItem = document.createElement("div");
                seriesItem.classList.add("collection-item");
                seriesItem.style.display = "block";
                seriesItem.innerHTML = `
                        <div class="watchlist-card--YfKgo" data-t="watch-list-card"><a tabindex="0" class="watchlist-card__content-link--Ujiaq" title="${item.title}" href="/it/watch/${item.id}/${item.slug_title}"></a>
                            <div class="watchlist-card-image--CMvVM">
                                ${item.new ? '<div class="content-tags-group--0ckbD watchlist-card-image__tags--cnj48">' +
                    '<div class="info-tag--iCqCs info-tag--is-one--Q6iut content-tags-group__item--rJ2ZA" d=ata-t"info-tag-new"><small class="text--gq6o- text--is-heavy--2YygX text--is-xs--5PTBo info-tag__item--avQcC">Nuovo</small></div>' +
                    '</div>' : ''}
                                <div class="content-image--3na7E content-image--is-sized--SOai1 watchlist-card-image__poster--W-MSe">
                                    <div class="content-image-figure-wrapper--pKs17 content-image__figure-wrapper--TRCnl">
                                        <div class="content-image-figure-wrapper__figure-sizer--SH2-x content-image__figure-sizer--is-background-type-one--Eo1qr"><svg class="content-image-figure-wrapper__sizer---PAKo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 3"></svg>
                                            <figure class="content-image__figure--7vume">
                                                <div class="progressive-image-loading--rwH3R">
                                                    <picture><img class="progressive-image-base__fade--Nrn20 progressive-image-base__fade--is-ready--dMxKu content-image__image--7tGlg progressive-image-loading__preview--eYvnH progressive-image-loading__preview--is-hidden--RLDT9" loading="lazy" src="${item.images.poster_wide[0][3].source}" alt="${item.title}" data-t="preview-image"></picture>
                                                    <picture><img class="content-image__image--7tGlg progressive-image-loading__original--k-k-7" loading="lazy" src="${item.images.poster_wide[0][3].source}" alt="${item.title}" data-t="original-image"></picture>
                                                </div>
                                            </figure>
                                        </div>
                                    </div>
                                </div>
                                <div class="content-image--3na7E content-image--is-sized--SOai1 watchlist-card-image__thumbnail--OD-tH">
                                    <div class="content-image-figure-wrapper--pKs17 content-image__figure-wrapper--TRCnl">
                                        <div class="content-image-figure-wrapper__figure-sizer--SH2-x content-image__figure-sizer--is-background-type-one--Eo1qr"><svg class="content-image-figure-wrapper__sizer---PAKo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"></svg>
                                            <figure class="content-image__figure--7vume">
                                                <div class="progressive-image-loading--rwH3R">
                                                    <picture><img class="progressive-image-base__fade--Nrn20 progressive-image-base__fade--is-ready--dMxKu content-image__image--7tGlg progressive-image-loading__preview--eYvnH progressive-image-loading__preview--is-hidden--RLDT9" loading="eager" src="${item.images.poster_wide[0][3].source}" alt="${item.title}" data-t="preview-image"></picture>
                                                    <picture><img class="content-image__image--7tGlg progressive-image-loading__original--k-k-7" loading="eager" src="${item.images.poster_wide[0][3].source}" alt="${item.title}" data-t="original-image"></picture>
                                                </div>
                                            </figure>
                                        </div>
                                    </div>
                                </div>
                                <div class="playable-thumbnail--HKMt2 watchlist-card-image__playable-thumbnail--4RQJC">
                                    <div class="content-image--3na7E content-image--is-background-type-one--1LQDe playable-thumbnail__image--AgM1B">
                                        <figure class="content-image__figure--7vume">
                                            <div class="progressive-image-loading--rwH3R">
                                                <picture><img class="progressive-image-base__fade--Nrn20 progressive-image-base__fade--is-ready--dMxKu content-image__image--7tGlg progressive-image-loading__preview--eYvnH progressive-image-loading__preview--is-hidden--RLDT9" loading="eager" src="${item.images.poster_wide[0][3].source}" alt="${item.title}" data-t="card-image"></picture>
                                                <picture><img class="content-image__image--7tGlg progressive-image-loading__original--k-k-7" loading="eager" src="${item.images.poster_wide[0][3].source}" alt="${item.title}" data-t="card-image"></picture>
                                            </div>
                                        </figure>
                                    </div>
                                    <div class="playable-thumbnail-icon--is-hovered--BKdRL">
                                        <div class="playable-thumbnail-icon__play-overlay--vzI7I">
                                            <div class="play-media-icon--CpSht play-media-icon--is-scalable--ZPGW9" data-t="playable-icon"><svg class="play-media-icon__symbol--feBy-" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-t="play-filled-svg" aria-labelledby="play-filled-svg" aria-hidden="true" role="img">
                                                <title id="play-filled-svg">Play</title>
                                                <path d="m4 2 16 10L4 22z"></path>
                                            </svg></div>
                                        </div>
                                    </div>
                                    <div class="content-tags-group--0ckbD playable-thumbnail__tags--wNuh1"></div>
                                    <div class="text--gq6o- text--is-semibold--AHOYN text--is-m--pqiL- playable-thumbnail__duration--p-Ldq" data-t="duration-info">${item.series_metadata.series_launch_year}</div>
                                </div>
                            </div>
                            <div class="watchlist-card-body--ZpYFy"><a tabindex="0" class="watchlist-card-title--o1sAO" href="/it/series/${item.id}/${item.slug_title}">
                                <h4 class="text--gq6o- text--is-semibold--AHOYN text--is-l--iccTo watchlist-card-title__text--chGlt">${item.title}</h4>
                            </a>
                                <h5 class="text--gq6o- text--is-m--pqiL- watchlist-card-subtitle--IROsU">Click to watch</h5>
                                <div class="watchlist-card-body-footer--bNjMg">
                                    <div class="meta-tags--o8OYw" data-t="meta-tags">
                                        <div class="meta-tags__tag-wrapper--fzf-1 meta-tags__tag-wrapper--is-inline--ug1Il"><span class="text--gq6o- text--is-m--pqiL-">Subbed</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                watchlistCollection.appendChild(seriesItem);
                if (currentIndex === series.length - 1) {
                    addMoreContainer.style.display = 'none';
                }
            });
            return currentIndex;
        }
    }
    sendResponse({
        success: true,
        data: 'Cards built successfully!',
    });
});