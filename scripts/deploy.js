const hre = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  const [deployer] = await ethers.getSigners()
  const Name= "Viki_tokens";
  const Symbol= "VKT";

  const TokenMaster= await ethers.getContractFactory("TokenMaster")
  const token_master= await TokenMaster.deploy(Name, Symbol)
  await token_master.deployed()

  console.log(`deployed TokenMaster contract at: ${token_master.address}\n`)
  const events = [
    {
      event_name:"Kmit evening",
      ticket_cost:tokens(0.25),
      tickets: 100,
      date:"Jan 1",
      time:"6:00PM IST",
      event_location:"Kmit, Narayanaguda, Hyd",
    },
    {
      event_name:"Kmit dandiya",
      ticket_cost:tokens(0.5),
      tickets: 0,
      date:"Oct 10",
      time:"7:00PM IST",
      event_location:"Kmit, Narayanaguda, Hyd",
    },
    {
      event_name:"New year celebration",
      ticket_cost:tokens(0.15),
      tickets: 100,
      date:"Dec 31",
      time:"10:00PM IST",
      event_location:"Alphores, kothapally, Karimnagar",
    },
    {
      event_name:"Dasara celebration",
      ticket_cost:tokens(0.25),
      tickets: 200,
      date:"Oct 10",
      time:"10:00PM IST",
      event_location:"Vivekananda Vidyalayam, gangadhara, Karimnagar",
    },
    {
      event_name:"Hackathon",
      ticket_cost:tokens(0.25),
      tickets: 250,
      date:"Nov 19",
      time:"1:00PM IST",
      event_location:"Kmit, Narayaguda, Hyd",
    }
  ]

  for(var i=0;i<5;i++){
    const transaction = await token_master.connect(deployer).list(
      events[i].event_name,
      events[i].ticket_cost,
      events[i].tickets,
      events[i].date,
      events[i].time,
      events[i].event_location
    )
    await transaction.wait()
    console.log(`Listed Event ${i+1} : ${events[i].event_name}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});