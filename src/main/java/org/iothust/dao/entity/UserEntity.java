package org.iothust.dao.entity;

public class UserEntity {
	private Long id;
	private String name;
	private CorpEntity corp;
	private Long corpId;
	private String secretLvl;

	public void setSecretLvl(String secretLvl) {
		this.secretLvl = secretLvl;
	}

	public String getSecretLvl() {
		return secretLvl;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getCorpId() {
		return corpId;
	}

	public void setCorpId(Long corpId) {
		this.corpId = corpId;
	}

	public CorpEntity getCorp() {
		return corp;
	}

	public void setCorp(CorpEntity corp) {
		this.corp = corp;
	}

	@Override
	public String toString() {
		return "UserEntity [id=" + id + ", name=" + name + ", corp=" + corp + ", corpId=" + corpId + "]";
	}
	
}
