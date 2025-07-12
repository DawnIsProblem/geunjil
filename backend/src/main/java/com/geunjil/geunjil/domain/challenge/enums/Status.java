package com.geunjil.geunjil.domain.challenge.enums;

public enum Status {

    PENDING("대기중"),
    ONGOING("진행중"),
    STOPED("중단"),
    FAIL("실패"),
    SUCCESS("성공");

    private final String label;

    Status (String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

}
