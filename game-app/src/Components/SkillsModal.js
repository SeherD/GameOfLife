import React, { Component } from 'react';
import SkillsCard from './SkillsCard';
import go from "../assets/go.png";
import python from "../assets/python.png";
import java from "../assets/java.png";


export default class SkillsModal extends Component {

    constructor(props) {
        super(props);
    }

    handleFreeSkill = () =>{
        //TODO: call flask endpoint to add this.props.freeSkill to player assets
        this.props.handleClose();
    }

    handleRiskySkill = () =>{
        this.props.onModalClose(this.props.riskySkill);
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
                skill={this.props.freeSkill}
                payoff={"$5,000"}
                raise={""}
                />
                <button onClick={this.handleFreeSkill}>Get Free Skill</button>
            </div>
            <div className='optionDiv'>
            <SkillsCard
                cert={true}
                image= {java}
                skill={this.props.riskySkill}
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