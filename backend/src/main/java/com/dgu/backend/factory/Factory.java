package com.dgu.backend.factory;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "factory")
@Getter
@NoArgsConstructor
public class Factory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cert_no")
    private String certNo;

    @Column(name = "name")
    private String name;

    @Column(name = "ceo")
    private String ceo;

    @Column(name = "industry")
    private String industry;

    @Column(name = "core_skill")
    private String coreSkill;

    @Column(name = "region")
    private String region;
}