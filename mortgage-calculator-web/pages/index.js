import React, { useState } from "react";

export default function Home() {
  const [price, setPrice] = useState("");
  const [down_payment, setDownPayment] = useState("");
  const [interest_rate, setInterestRate] = useState("");
  const [amortization_period, setAmortizationPeriod] = useState("5");
  const [schedule, setSchedule] = useState("biweekly");
  const [calculated_result, setResult] = useState("")
	const calculateMortgagePayment = async () => {
		try {
			const res = await fetch(
				`http://localhost:5000/mortgage/calculate`,
        {
          method: "POST",
          body: JSON.stringify({
            price: parseFloat(price),
            down_payment: parseFloat(down_payment),
            interest_rate: parseFloat(interest_rate),
            amortization_period: parseFloat(amortization_period),
            schedule: schedule
          }),
          headers: {
            "content-type": "application/json",
          },
          mode: 'cors'
        });
			const data = await res.json();
      const status_code = res.status
      if (status_code != 200) {
        setResult([<b>Error: </b>, data["error"], <br/>, <b>Details: </b>, <br/>, data["message"].flatMap(e => [e.charAt(0).toUpperCase() + e.replace("_", " ").slice(1), <br/>]).slice(0, -1)])
      } else {
        let frequency = "Bi-weekly"
        if (schedule == 'monthly') {
          frequency = "Monthly"
        }
        setResult([<b>{frequency} mortgage payment: </b>, data["payment"]])
      }
		} catch (err) {
			console.log(err);
      setResult("Error: " + err)
		}
	};
	return (
		<div style={{fontFamily: "Trebuchet MS", lineHeight: "200%", alignment: "center" }}>
      <span style={{fontSize: 24}}><b>BC Mortgage Payment Calculator</b></span>

      <hr></hr>

      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            calculateMortgagePayment();
          }}
        >
          <span><b>Property Price: </b></span>
          <input
            name="price"
            placeholder="Set property price..."
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          ></input>

          <br/>
          
          <span><b>Down Payment: </b></span>
          <input
            name="down_payment"
            placeholder="Set down payment..."
            value={down_payment}
            onChange={(e) => setDownPayment(e.target.value)}
          ></input>

          <br/>

          <span><b>Annual Interest Rate: </b></span>
          <input
            name="interest_rate"
            placeholder="Set interest rate..."
            value={interest_rate}
            onChange={(e) => setInterestRate(e.target.value)}
          ></input>

          <br/>

          <span><b>Amortization Period: </b></span>
          <select 
            name="amortization_period"
            value={amortization_period}
            onChange={(e) => setAmortizationPeriod(e.target.value)}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
          </select>

          <br/>

          <span><b>Payment Schedule: </b></span>
          <select 
            name="schedule"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
          >
            <option value="biweekly">Bi-weekly</option>
            <option value="accelerated_biweekly">Accelerated Bi-weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          <br/>

          <button type="submit">Calculate Mortgage Payment</button>
          <hr></hr>
        </form>
      </div>
      <div>
        <span style={{fontSize: 20}}><b>Result:</b></span>
        <br/>
        {calculated_result}
      </div>
    </div>
	);
}