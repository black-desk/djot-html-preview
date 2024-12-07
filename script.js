document.addEventListener('DOMContentLoaded', async function() {
        const params = new URLSearchParams(window.location.search);
        let url = params.get('url');
        if (!url) {
                url = 'https://github.com/black-desk/djot-html-preview/blob/master/README.dj';
        }

        const githubUrlPattern = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/(.+)\/(.+)/;
        const match = url.match(githubUrlPattern);

        if (match) try {
                const owner = match[1];
                const repo = match[2];
                const ref = match[3];
                const path = match[4];
                const apiUrl =
                        `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${ref}`;

                url = await fetch(apiUrl, {
                        headers: {
                                'Accept': 'application/vnd.github+json',
                                'X-GitHub-Api-Version': '2022-11-28'
                        }
                })
                        .then(response => response.json())
                        .then(json => json.download_url);

        } catch (error) {
                console.error(`Error to get raw file download link from ${apiUrl}: ${error}`);
        }

        try {
                document.getElementById('content').innerHTML =
                        djot.renderHTML(djot.parse(
                                await fetch(url).then(response => response.text())
                        ));
        } catch (error) {
                console.error('Error fetching or rendering content:', error);
                document.getElementById('content').innerHTML = '<p>Error</p>';
        }
});
