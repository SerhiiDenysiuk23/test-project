<?php
namespace Vendor\Name\models;

class Photo{
    public string $albumId;
    public string $id;
    public string $title;
    public string $url;

    public function __construct(array $data)
    {
        $this->albumId = $data['albumId'];
        $this->id = $data['id'] ?? uniqid();
        $this->title = $data['title'] ?? '';
        $this->url = $data['url'] ?? '';
    }
}