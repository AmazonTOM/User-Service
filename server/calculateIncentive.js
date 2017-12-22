const geodist = require('geodist');


const calculate = (location, cart, client, response) => {
  client.search(cart)
    .then((results) => {
      const { rows } = results;
      let dist = 0;
      let temp;
      for (let i = 0; i < rows.length; i += 1) {
        let findSmallest;
        let val;
        for (let j = 0; j < rows[i].warehouses.length; j += 1) {
          const check = rows[i].warehouses[j];
          const checkdist = geodist(
            { lat: location.latitude, lon: location.longitude },
            { lat: check.latitude, lon: check.longitude },
            { exact: true, unit: 'km' },
          );
          if (checkdist <= findSmallest || findSmallest === undefined) {
            findSmallest = checkdist;
            val = rows[i];
          }
          if (findSmallest > dist && j === rows[i].warehouses.length - 1) {
            dist = findSmallest;
            temp = val;
          }
        }
      }
      console.log(dist, temp);
      if (dist > 4000) {
        response.status(200).send({
          incentive: 5,
        });
      } else if (dist > 3000) {
        response.status(200).send({
          incentive: 4,
        });
      } else if (dist > 2000) {
        response.status(200).send({
          incentive: 3,
        });
      } else if (dist > 1000) {
        response.status(200).send({
          incentive: 2,
        });
      } else if (dist > 0) {
        response.status(200).send({
          incentive: 1,
        });
      }
    })
    .catch((results) => { console.log(results); });


  return 0;
};

module.exports = calculate;
