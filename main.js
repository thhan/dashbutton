const {exec} = require('child_process');

const DashButtons = {
  "B4:7C:9C:D7:BC:5D": {
    Name: "Flur"
  }
};

function scan(ops) {
  let ans = [];
  return new Promise(function(response, reject) {
    exec('arp-scan -l -I ' + ops.dev, function(err, stdout, stderr) {
      if (err) {
        console.log("child processes failed with error code: " +
                    err.code + stderr);
      }
      let net = stdout.split('\n');
      for (let i = 2; i < net.length - 4; i++) {
        let chunk = net[i].split('\t');
        ans.push({'ip' : chunk[0], 'mac' : chunk[1].toUpperCase(), 'vendor' : chunk[2]});
      }
      response(ans);
    });
  });
}


function checkNetwork() {

  scan({dev : 'en0'}).then((response) => {
    for (let i = 0; i < response.length; i++) {
      if (DashButtons[response[i].mac]) {
        console.log(DashButtons[response[i].mac].Name)
      }
    }
    checkNetwork()
  });

}

checkNetwork()
