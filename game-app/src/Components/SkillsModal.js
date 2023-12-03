import React, { Component } from 'react';
import SkillsCard from './SkillsCard';
import python from "../assets/python.png";
import java from "../assets/java.png";
import axios from 'axios';


export default class SkillsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            skill: {CertName: "Java"},
            cert: {CertName: "C"}
        };
    }

    componentDidMount() {
        axios({
            method: "GET",
            url:"http://localhost:5000/certifications/get-random-certs/P" + (this.props.playerIndex + 1),
          })
          .then((response) => {
            this.setState({skill: response.data[0], cert: response.data[1]});
            console.log("SKills are " + response.data)

          })
    }

    handleFreeSkill = () =>{
        this.props.onModalClose(0, this.state.skill.CertID);
        this.props.handleClose();
    }

    handleRiskySkill = () =>{
        this.props.handleRespin(this.state.cert.CertID);
        this.props.handleClose();
    }
  
    render() {
        return (
            <div>
            <h1>Choose a Skill</h1>
            <div className="skillOptionsDiv">
            <div className='optionDiv'>
            <SkillsCard
                cert={false}
                image= {python}
                skill={this.state.skill.CertName}
                payoff={"$5,000"}
                raise={""}
                />
                <button onClick={this.handleFreeSkill}>Get Free Skill</button>
            </div>
            <div className='optionDiv'>
            <SkillsCard
                cert={true}
                image= {java}
                skill={this.state.cert.CertName}
                payoff={"$5,000"}
                raise={"$2,000"}
                />
                <button onClick={this.handleRiskySkill}>Spin for Chance to Gain the Certification</button>
            </div>
            </div>
            </div>
          );
    }
}