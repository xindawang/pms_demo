package org.iothust.dao.entity;

public class DataEntity extends TierBaseEntity{
	private Long id;
	private Long relId;
	private String relTable;
	private String relName;
	private String name;
	private String abbr;
	private String code;
	private Integer fill;
	private Integer frequency;
	private String input_output;
	private String type;
	private Integer securityLevel;
	private String value;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getRelId() {
		return relId;
	}

	public void setRelId(Long relId) {
		this.relId = relId;
	}
	
	public String getRelTable() {
		return relTable;
	}

	public void setRelTable(String relTable) {
		this.relTable = relTable;
	}
	
	public String getRelName() {
		return relName;
	}

	public void setRelName(String relName) {
		this.relName = relName;
	}

	
	public String getName() {
		return name;
	}
	
	public void setName(String name){
		this.name = name;
	}
	
	public String getAbbr(){
		return abbr;
	}
	
	public void setAbbr(String abbr){
		this.abbr = abbr;
	}
	
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Integer getFill(){
		return fill;
	}
	
	public void setFill(Integer fill){
		this.fill = fill;
	}
	
	public Integer getFrequency(){
		return frequency;
	}
	
	public void setFrequency(Integer frequency){
		this.frequency = frequency;
	}
	
	public String getInput_output(){
		return input_output;
	}
	
	public void setInput_output(String input_output){
		this.input_output = input_output;
	}
	
	public String getType(){
		return type;
	}
	
	public void setType(String type){
		this.type = type;
	}
	
	public String getValue(){
		return value;
	}
	
	public void setValue(String value){
		this.value = value;
	}
	@Override
	public String toString() {
		return "DataEntity [id=" + id + ", relId=" + relId + ", relTable=" + relTable + ", relName=" + relName
				+ ", name=" + name + ", abbr=" + abbr + ", code=" + code + ", fill=" + fill + ", frequency=" + frequency
				+ ", input_output=" + input_output + ", type=" + type + ", securityLevel=" + securityLevel + ", value=" + value + "]";
	}

	public Integer getSecurityLevel() {
		return securityLevel;
	}

	public void setSecurityLevel(Integer securityLevel) {
		this.securityLevel = securityLevel;
	}


}
