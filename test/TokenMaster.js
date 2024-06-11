const { expect } = require("chai")
// chai library is used to check the working of our blockcain smart contract 
// to run this file use command 
// npx hardhat test

const Name= "Viki_tokens";
const Symbol= "VKT";
const Event_Name= "Kmit evening"
const Ticket_Cost= ethers.utils.parseUnits('1','ether')
const Total_Tickets= 100
const Event_Date="Jan 1"
const Event_Time="10:00 AM"
const Event_Location="KMIT, Naryanaguda, Hyd"

describe("TokenMaster", () => {
    let TokenMaster
    let token_master
    let deployer, buyer
    beforeEach(async ()=>{
        [deployer, buyer]= await ethers.getSigners();
        const TokenMaster= await ethers.getContractFactory("TokenMaster")
        token_master= await TokenMaster.deploy(Name, Symbol)

        // transcation done by one of the signers here the deployer
        const transcation= await token_master.connect(deployer).list(
            Event_Name,
            Ticket_Cost,
            Total_Tickets,
            Event_Date,
            Event_Time,
            Event_Location
        );
        //  we will wait until transcation is added to block
        await transcation.wait()
    })

    describe("Deploymnet", ()=>{
        // we gave sample token name and symbol to check whether the smart contract nft constructor is working correctly or not
        it("Setting the nft name", async()=>{
            let name= await token_master.name();
            expect(name).to.equal("Viki_tokens");
        })

        it("sets the nft symbol", async()=>{
            let symbol= await token_master.symbol();
            expect(symbol).to.equal("VKT");
        })

        it("set the owner", async()=>{
            expect(await token_master.owner()).to.equal(deployer.address);
        })
    })
    describe("Events present", ()=>{
        // checking the event details and the event count
        it("update the event count", async()=>{
            const total_events = await token_master.total_events();
            expect(total_events).to.be.equal(1)
        })

        it("check the data", async()=>{
            const event_data= await token_master.get_event_details(1);
            expect(event_data.id).to.be.equal(1);
            expect(event_data.event_name).to.be.equal(Event_Name);
            expect(event_data.ticket_cost).to.be.equal(Ticket_Cost);
            expect(event_data.total_tickets).to.be.equal(Total_Tickets);
            expect(event_data.date).to.be.equal(Event_Date);
            expect(event_data.time).to.be.equal(Event_Time);
            expect(event_data.event_location).to.be.equal(Event_Location);
        })
    })
    describe("buying tickets", ()=>{
        const Event_Id= 1;
        const Seat_Number= 50;
        const Ticket_Amount= ethers.utils.parseUnits('1','ether')

        beforeEach(async()=>{
            const transcation= await token_master.connect(buyer).mint(Event_Id, Seat_Number, {value: Ticket_Amount});
            await transcation.wait();
            // in the above id and seat number are parameters and value is meta data which the buyer has to send to the smart contract
        })

        it("Update the ticket count", async ()=>{
            const event= await token_master.get_event_details(Event_Id);
            expect(event.tickets).to.be.equal(Total_Tickets-1);
        })

        it("update buying status",async ()=>{
            const status= await token_master.has_bought(Event_Id, buyer.address)
            expect(status).to.be.equal(true)
        })

        it("update seat status",async()=>{
            const owner= await token_master.seatTaken(Event_Id, Seat_Number);
            expect(owner).to.be.equal(buyer.address);
        })

        it("update all seats status", async()=>{
            const seats= await token_master.get_seats_taken(Event_Id);
            expect(seats.length).to.equal(1)
            expect(seats[0]).to.equal(Seat_Number)
        })

        // This test case checks if the balance of the token_master smart contract is equal to the expected Ticket_Amount. It does this by getting the balance of the token_master smart contract and comparing it with the expected Ticket_Amount.
        it("update total amount", async()=>{
            const balance= await ethers.provider.getBalance(token_master.address);
            expect(balance).to.be.equal(Ticket_Amount)
        })
    })
    describe("Withdraw to deployer", ()=>{
        const Event_Id= 1;
        const Seat_Number= 50;
        const Ticket_Amount= ethers.utils.parseUnits('1','ether')
        let balance_before;
        beforeEach(async()=>{
            balance_before= await ethers.provider.getBalance(deployer.address)
            let transaction = await token_master.connect(buyer).mint(Event_Id, Seat_Number, {value: Ticket_Amount});
            await transaction.wait();

            transaction = await token_master.connect(deployer).withdraw_by_owner();
            await transaction.wait();
        })

        it("Updates to owner balance", async() =>{
            const balance_after = await ethers.provider.getBalance(deployer.address);
            expect(balance_after).to.be.greaterThan(balance_before)
        })
        it("updates the contract balance",async ()=>{
            const balance= await ethers.provider.getBalance(token_master.address);
            expect(balance).to.be.equal(0)
        })
    })

})
