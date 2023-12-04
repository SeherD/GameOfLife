import React, { Component } from 'react';
import SkillsCard from './SkillsCard';
import python from "../assets/python.png";
import java from "../assets/java.png";
import axios from 'axios';
import { LanguageImage } from './services/LanguageImage';


export default class SkillsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            skill: {},
            cert: {},
            skillImage: null,
            certImage: null
        };
    }

    componentDidMount() {
        axios({
            method: "GET",
            url:"http://localhost:5000/certifications/get-random-certs/P" + (this.props.playerIndex + 1),
          })
          .then((response) => {
        const img1 = LanguageImage.GetImage(response.data[0].Image);
        const img2 = LanguageImage.GetImage(response.data[1].Image);

            this.setState({skill: response.data[0], cert: response.data[1], skillImage: img1, certImage: img2});
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
                image= {this.state.skillImage}
                skill={this.state.skill.CertName}
                payoff={"$5,000"}
                raise={""}
                />
                <button onClick={this.handleFreeSkill}>Get Free Skill</button>
            </div>
            <div className='optionDiv'>
            <SkillsCard
                cert={true}
                image= {this.state.certImage}
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