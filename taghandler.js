async function loadTagsAndPosts() {
    try {
        const response = await fetch('/tags.json');
        const tagData = await response.json();

        const allTags = new Set();
        for (const tags of Object.values(tagData)) {
            tags.forEach(tag => allTags.add(tag));
        }

        const tagFilter = document.getElementById('tagFilter');
        const defaultOption = document.createElement('option');
        defaultOption.value = 'all';
        defaultOption.textContent = 'Alle tags';
        tagFilter.appendChild(defaultOption);

        allTags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            tagFilter.appendChild(option);
        });

        const blogContainer = document.getElementById('blogPostsContainer');

        function renderPosts(filter = 'all') {
            blogContainer.innerHTML = '';
            const sortedWeeks = Object.keys(tagData).sort((a, b) => {
                return parseInt(a.replace('week', '')) - parseInt(b.replace('week', ''));
            });

            sortedWeeks.forEach(weekKey => {
                const tags = tagData[weekKey];
                if (filter === 'all' || tags.includes(filter)) {
                    const weekNumber = weekKey.replace('week', '');
                    const col = document.createElement('div');
                    col.className = 'col-md-6';

                    const box = document.createElement('div');
                    box.className = 'version-box';

                    // Header: weektitel links, link rechts
                    const headerRow = document.createElement('div');
                    headerRow.className = 'd-flex justify-content-between align-items-center';

                    const h5 = document.createElement('h5');
                    h5.textContent = `Week ${weekNumber}`;
                    h5.className = 'week-title mb-2';

                    const link = document.createElement('a');
                    link.href = `/blog/${weekKey}`;
                    link.textContent = `Lees Week ${weekNumber} ›`;
                    link.className = 'blog-link';

                    headerRow.appendChild(h5);
                    headerRow.appendChild(link);
                    box.appendChild(headerRow);

                    // Tags
                    const tagContainer = document.createElement('div');
                    tagContainer.className = 'mt-2';
                    tags.forEach(tag => {
                        const span = document.createElement('span');
                        span.className = 'tag-badge';
                        span.textContent = tag;
                        tagContainer.appendChild(span);
                    });

                    box.appendChild(tagContainer);
                    col.appendChild(box);
                    blogContainer.appendChild(col);
                }
            });
        }

        tagFilter.addEventListener('change', () => renderPosts(tagFilter.value));
        renderPosts();

    } catch (error) {
        console.error('Fout bij laden van tags.json:', error);
    }
}

loadTagsAndPosts();
