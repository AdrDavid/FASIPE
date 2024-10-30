function abrir_sidebar() {
    const element = document.getElementById('sidebar');
     if(element.classList.contains('none')){
        element.classList.remove('none');
        element.classList.add('flex')
    }else{
        element.classList.add('none')
        element.classList.remove('flex');

     }
}

document.getElementById('shareButton').addEventListener('click', async () => {
    const shareData = {
        title: '<%= noticia.titulo %>',
        text: '<%= noticia.subtitulo %>',
        url: window.location.href
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
            console.log('Conteúdo compartilhado com sucesso');
        } catch (err) {
            console.error('Erro ao compartilhar:', err);
        }
    } else {
        try {
            await navigator.clipboard.writeText(window.location.href);
            document.getElementById('shareMessage').style.display = 'inline';
            setTimeout(() => {
                document.getElementById('shareMessage').style.display = 'none';
            }, 2000);
            console.log('Link copiado para a área de transferência');
        } catch (err) {
            console.error('Erro ao copiar o link:', err);
            alert('Não foi possível compartilhar o link. Copie manualmente: ' + window.location.href);
        }
    }
});