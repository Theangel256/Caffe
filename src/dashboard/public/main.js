const p = document.getElementById('discord-auth');
p.onclick = windowOpen;
function windowOpen(event) {
	event.preventDefault();
	window.open(`${process.env.URL}/signin`, 'Login to Caffe', 'menubar=no,width=500,height=777,location=no,resizable=no,scrollbars=yes,status=no');
	event.addEventListener(); {
		if (window.opener) {
			window.opener.postMessage({ code: req.params.code }, 'https://caffe.sirnice.xyz/');
			setTimeout(function() { window.close(); }, 500);
		}
		else {
			window.location.replace(`https://caffe.sirnice.xyz/signin?code=${req.params.code}`);
		}
	}
}